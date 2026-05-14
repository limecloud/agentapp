#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const cliVersion = '0.1.0'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  if (!command || command === '--help' || command === '-h') return printHelp()
  if (command === '--version' || command === '-v') {
    console.log(cliVersion)
    return
  }

  try {
    switch (command) {
      case 'validate':
        return writeJson(validateApp(requiredArg(args, 1, 'app path')))
      case 'read-properties':
        return writeJson(readProperties(requiredArg(args, 1, 'app path')))
      case 'to-catalog':
        return writeJson(toCatalog(requiredArg(args, 1, 'app path')))
      case 'project':
        return writeJson(projectApp(requiredArg(args, 1, 'app path')))
      case 'readiness':
        return writeJson(readiness(requiredArg(args, 1, 'app path'), args.slice(2)))
      default:
        return fail(`Unknown command: ${command}`, 2)
    }
  } catch (error) {
    return fail(error.message || String(error), 2)
  }
}

function printHelp() {
  console.log(`agentapp-ref ${cliVersion}

Usage:
  agentapp-ref validate <app>
  agentapp-ref read-properties <app>
  agentapp-ref to-catalog <app>
  agentapp-ref project <app>
  agentapp-ref readiness <app> [--workspace <path>]

Commands:
  validate          Validate APP.md shape and local references.
  read-properties   Read APP.md frontmatter as JSON.
  to-catalog        Emit compact app catalog metadata.
  project           Emit host catalog projection with provenance.
  readiness         Check static setup readiness without running an agent.

Output:
  JSON is written to stdout. Diagnostics are written to stderr.
`)
}

function validateApp(appPath) {
  const appRoot = resolve(appPath)
  const findings = []
  if (!existsSync(appRoot) || !statSync(appRoot).isDirectory()) {
    findings.push(errorFinding('.', 'App path is not a directory.'))
    return envelope(false, 'failed', 'validate', basename(appRoot), findings)
  }

  const appMd = join(appRoot, 'APP.md')
  if (!existsSync(appMd)) {
    findings.push(errorFinding('APP.md', 'Missing required APP.md.'))
    return envelope(false, 'failed', 'validate', basename(appRoot), findings)
  }

  const properties = readAppProperties(appMd)
  for (const field of ['name', 'description', 'version', 'status', 'appType']) {
    if (!properties[field]) findings.push(errorFinding('APP.md', `Missing required frontmatter field: ${field}.`))
  }
  if (properties.name && properties.name !== basename(appRoot)) {
    findings.push(warningFinding('APP.md', `name does not match parent directory: ${properties.name} != ${basename(appRoot)}.`))
  }
  if (properties.status && !['draft', 'ready', 'needs-review', 'deprecated', 'archived'].includes(properties.status)) {
    findings.push(errorFinding('APP.md', `Unknown status: ${properties.status}.`))
  }
  if (properties.appType && !['agent-app', 'workflow-app', 'domain-app', 'customer-app', 'custom'].includes(properties.appType)) {
    findings.push(errorFinding('APP.md', `Unknown appType: ${properties.appType}.`))
  }

  checkDirectoryRefs(appRoot, properties.skillRefs, 'skills', findings)
  checkDirectoryRefs(appRoot, properties.knowledgeTemplates, 'knowledge-templates', findings)
  checkDirectoryRefs(appRoot, properties.toolRefs, 'tools', findings)
  checkDirectoryRefs(appRoot, properties.artifactTypes, 'artifacts', findings)
  checkDirectoryRefs(appRoot, properties.evals, 'evals', findings)

  const ok = findings.every((finding) => finding.severity !== 'error')
  return envelope(ok, ok ? 'passed' : 'needs-review', 'validate', properties.name || basename(appRoot), findings, { manifestHash: hashFile(appMd) })
}

function readProperties(appPath) {
  const appMd = join(resolve(appPath), 'APP.md')
  if (!existsSync(appMd)) throw new Error('Missing APP.md')
  return readAppProperties(appMd)
}

function toCatalog(appPath) {
  const properties = readProperties(appPath)
  const allowed = ['name', 'description', 'version', 'status', 'appType', 'runtimeTargets', 'entries', 'capabilities', 'presentation', 'compatibility', 'metadata']
  return Object.fromEntries(allowed.filter((key) => properties[key] !== undefined).map((key) => [key, properties[key]]))
}

function projectApp(appPath) {
  const appRoot = resolve(appPath)
  const properties = readProperties(appRoot)
  const appMd = join(appRoot, 'APP.md')
  const manifestHash = hashFile(appMd)
  const provenance = {
    appName: properties.name || basename(appRoot),
    appVersion: properties.version || '0.0.0',
    manifestHash,
    standard: 'agentapp',
    standardVersion: cliVersion
  }
  const withProvenance = (items = []) => asArray(items).map((item) => ({ ...item, provenance }))
  return {
    ok: true,
    command: 'project',
    app: {
      name: properties.name,
      description: properties.description,
      version: properties.version,
      status: properties.status,
      appType: properties.appType,
      runtimeTargets: asArray(properties.runtimeTargets),
      presentation: properties.presentation || {}
    },
    entries: withProvenance(properties.entries),
    knowledgeTemplates: withProvenance(properties.knowledgeTemplates),
    toolRequirements: withProvenance(properties.toolRefs),
    artifactTypes: withProvenance(properties.artifactTypes),
    evals: withProvenance(properties.evals),
    provenance
  }
}

function readiness(appPath, args) {
  const appRoot = resolve(appPath)
  const workspace = optionValue(args, '--workspace')
  const properties = readProperties(appRoot)
  const checks = []

  addRequirementChecks('skill', properties.skillRefs, checks)
  addRequirementChecks('knowledge', properties.knowledgeTemplates, checks)
  addRequirementChecks('tool', properties.toolRefs, checks)
  addRequirementChecks('artifact', properties.artifactTypes, checks)
  addRequirementChecks('eval', properties.evals, checks)

  if (workspace && (!existsSync(resolve(workspace)) || !statSync(resolve(workspace)).isDirectory())) {
    checks.push({ severity: 'error', kind: 'workspace', key: workspace, message: 'Workspace path is not a directory.' })
  }
  if (!asArray(properties.entries).length) checks.push({ severity: 'warning', kind: 'entry', key: 'entries', message: 'No app entries declared.' })
  if (!asArray(properties.runtimeTargets).includes('local')) checks.push({ severity: 'warning', kind: 'runtime', key: 'runtimeTargets', message: 'App does not explicitly declare local runtime support.' })

  const hasError = checks.some((check) => check.severity === 'error')
  const hasWarning = checks.some((check) => check.severity === 'warning')
  return {
    ok: !hasError,
    status: hasError ? 'failed' : hasWarning ? 'needs-setup' : 'ready',
    command: 'readiness',
    app: properties.name || basename(appRoot),
    workspace: workspace || null,
    checks
  }
}

function addRequirementChecks(kind, items, checks) {
  for (const item of asArray(items)) {
    const required = item.required === true || item.required === 'true'
    const key = item.key || item.id || item.name || kind
    checks.push({
      severity: required ? 'warning' : 'info',
      kind,
      key,
      required,
      message: required ? `${kind} requirement must be satisfied by the host before running.` : `${kind} requirement is optional.`
    })
  }
}

function checkDirectoryRefs(appRoot, items, directory, findings) {
  for (const item of asArray(items)) {
    if (!item.path) continue
    const absolute = join(appRoot, item.path)
    if (!existsSync(absolute)) findings.push(warningFinding(directory, `Referenced path does not exist: ${item.path}.`))
  }
}

function readAppProperties(appMd) {
  const content = readFileSync(appMd, 'utf8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  return parseYamlSubset(match[1])
}

function parseYamlSubset(source) {
  const rootValue = {}
  const stack = [{ indent: -1, value: rootValue }]
  const lines = source.split('\n')
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i]
    if (!raw.trim() || raw.trim().startsWith('#')) continue
    const indent = raw.match(/^ */)[0].length
    const trimmed = raw.trim()
    while (stack.length > 1 && indent <= stack.at(-1).indent) stack.pop()
    const parent = stack.at(-1).value

    if (trimmed.startsWith('- ')) {
      if (!Array.isArray(parent)) continue
      const payload = trimmed.slice(2).trim()
      if (!payload) {
        const item = {}
        parent.push(item)
        stack.push({ indent, value: item })
        continue
      }
      if (payload.includes(':')) {
        const item = {}
        parent.push(item)
        parseKeyValueInto(item, payload)
        stack.push({ indent, value: item })
      } else {
        parent.push(parseScalar(payload))
      }
      continue
    }

    const index = trimmed.indexOf(':')
    if (index === -1 || Array.isArray(parent)) continue
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    if (!value) {
      const next = nextMeaningfulLine(lines, i + 1)
      const container = next?.trim().startsWith('- ') ? [] : {}
      parent[key] = container
      stack.push({ indent, value: container })
    } else {
      parent[key] = parseScalar(value)
    }
  }
  return rootValue
}

function parseKeyValueInto(target, payload) {
  const index = payload.indexOf(':')
  const key = payload.slice(0, index).trim()
  const value = payload.slice(index + 1).trim()
  target[key] = value ? parseScalar(value) : {}
}

function nextMeaningfulLine(lines, start) {
  for (let i = start; i < lines.length; i += 1) {
    if (lines[i].trim() && !lines[i].trim().startsWith('#')) return lines[i]
  }
  return null
}

function parseScalar(value) {
  const unquoted = ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) ? value.slice(1, -1) : value
  if (unquoted === 'true') return true
  if (unquoted === 'false') return false
  if (unquoted === 'null') return null
  if (/^-?\d+(\.\d+)?$/.test(unquoted)) return Number(unquoted)
  if (unquoted.startsWith('[') && unquoted.endsWith(']')) {
    return unquoted.slice(1, -1).split(',').map((part) => parseScalar(part.trim())).filter((part) => part !== '')
  }
  return unquoted
}

function hashFile(path) {
  return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function requiredArg(args, index, label) {
  if (!args[index]) throw new Error(`Missing ${label}`)
  return args[index]
}

function optionValue(args, option) {
  const index = args.indexOf(option)
  if (index === -1) return undefined
  return args[index + 1]
}

function envelope(ok, status, command, app, findings = [], extra = {}) {
  return { ok, status, command, app, findings, ...extra }
}

function errorFinding(path, message) {
  return { severity: 'error', path, message }
}

function warningFinding(path, message) {
  return { severity: 'warning', path, message }
}

function writeJson(value) {
  console.log(JSON.stringify(value, null, 2))
  if (value?.ok === false) process.exitCode = 1
}

function fail(message, code) {
  console.error(message)
  process.exit(code)
}

main()
