#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const cliVersion = '0.5.0'
const currentEntryKinds = new Set(['page', 'panel', 'expert-chat', 'command', 'workflow', 'artifact', 'background-task', 'settings'])
const legacyEntryKinds = new Set(['home', 'scene'])
const supportedManifestVersions = new Set(['0.3.0', '0.4.0', '0.5.0'])
const v05LayeredFiles = [
  'app.capabilities.yaml',
  'app.entries.yaml',
  'app.permissions.yaml',
  'app.errors.yaml',
  'app.i18n.yaml',
  'app.signature.yaml',
  'evals/readiness.yaml',
  'evals/health.yaml'
]
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
        return writeJson(validateApp(requiredArg(args, 1, 'app path'), args.slice(2)))
      case 'read-properties':
        return writeJson(readProperties(requiredArg(args, 1, 'app path')))
      case 'to-catalog':
        return writeJson(toCatalog(requiredArg(args, 1, 'app path')))
      case 'project':
        return writeJson(projectApp(requiredArg(args, 1, 'app path')))
      case 'readiness':
        return writeJson(readiness(requiredArg(args, 1, 'app path'), args.slice(2)))
      case 'migrate-check':
        return writeJson(migrateCheck(requiredArg(args, 1, 'app path'), args.slice(2)))
      case 'migrate-generate':
        return writeJson(migrateGenerate(requiredArg(args, 1, 'app path'), args.slice(2)))
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
  agentapp-ref validate <app> [--version <0.3|0.4|0.5>]
  agentapp-ref read-properties <app>
  agentapp-ref to-catalog <app>
  agentapp-ref project <app>
  agentapp-ref readiness <app> [--workspace <path>]
  agentapp-ref migrate-check <app>
  agentapp-ref migrate-generate <app> [--target 0.5.0]

Commands:
  validate          Validate APP.md shape and local references.
  read-properties   Read APP.md frontmatter as JSON.
  to-catalog        Emit compact app catalog metadata.
  project           Emit host catalog projection with provenance.
  readiness         Check static setup readiness without running an agent.
  migrate-check     Inspect a v0.3/v0.4 app and report v0.5 migration gaps.
  migrate-generate  Suggest v0.5 layered config files for a v0.3/v0.4 app.

Output:
  JSON is written to stdout. Diagnostics are written to stderr.
`)
}

function validateApp(appPath, options = []) {
  const appRoot = resolve(appPath)
  const findings = []
  const targetVersion = parseVersionFlag(options)
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

  if (properties.manifestVersion && !supportedManifestVersions.has(properties.manifestVersion)) {
    findings.push(warningFinding('APP.md', `Unknown manifestVersion: ${properties.manifestVersion}. Supported: ${[...supportedManifestVersions].join(', ')}.`))
  }
  if (targetVersion && properties.manifestVersion && properties.manifestVersion !== targetVersion) {
    findings.push(warningFinding('APP.md', `manifestVersion ${properties.manifestVersion} does not match requested --version ${targetVersion}.`))
  }

  const effectiveVersion = targetVersion || properties.manifestVersion || '0.4.0'
  if (effectiveVersion === '0.5.0') {
    checkV05Conventions(appRoot, properties, findings)
  }

  checkEntries(properties.entries, properties, findings)
  checkProductRuntime(properties, findings)
  checkDirectoryRefs(appRoot, properties.skillRefs, 'skills', findings)
  checkDirectoryRefs(appRoot, properties.knowledgeTemplates, 'knowledge-templates', findings)
  checkDirectoryRefs(appRoot, properties.toolRefs, 'tools', findings)
  checkDirectoryRefs(appRoot, properties.artifactTypes, 'artifacts', findings)
  checkDirectoryRefs(appRoot, properties.evals, 'evals', findings)
  checkDirectoryRefs(appRoot, properties.overlayTemplates, 'overlay-templates', findings)
  checkRuntimePackageRefs(appRoot, properties.runtimePackage, findings)
  checkStorageRefs(appRoot, properties.storage, findings)
  checkExecutablePolicy(properties, findings)

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
  const allowed = [
    'name',
    'description',
    'version',
    'status',
    'appType',
    'manifestVersion',
    'runtimeTargets',
    'requires',
    'entries',
    'capabilities',
    'ui',
    'storage',
    'services',
    'presentation',
    'compatibility',
    'metadata'
  ]
  return Object.fromEntries(allowed.filter((key) => properties[key] !== undefined).map((key) => [key, properties[key]]))
}

function projectApp(appPath) {
  const appRoot = resolve(appPath)
  const properties = readProperties(appRoot)
  const appMd = join(appRoot, 'APP.md')
  const manifestHash = hashFile(appMd)
  const packageHash = properties.runtimePackage?.hash || hashDirectory(appRoot)
  const provenance = {
    appName: properties.name || basename(appRoot),
    appVersion: properties.version || '0.0.0',
    packageHash,
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
      manifestVersion: properties.manifestVersion,
      runtimeTargets: asArray(properties.runtimeTargets),
      presentation: properties.presentation || {}
    },
    capabilityRequirements: properties.requires || {},
    entries: withProvenance(properties.entries),
    ui: properties.ui || {},
    storage: properties.storage || {},
    services: withProvenance(properties.services),
    workflows: withProvenance(properties.workflows),
    permissions: withProvenance(properties.permissions),
    knowledgeTemplates: withProvenance(properties.knowledgeTemplates),
    toolRequirements: withProvenance(properties.toolRefs),
    artifactTypes: withProvenance(properties.artifactTypes),
    evals: withProvenance(properties.evals),
    events: withProvenance(properties.events),
    secrets: withProvenance(properties.secrets),
    overlayTemplates: withProvenance(properties.overlayTemplates),
    lifecycle: properties.lifecycle || {},
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
  addRequirementChecks('service', properties.services, checks)
  addRequirementChecks('workflow', properties.workflows, checks)
  addRequirementChecks('secret', properties.secrets, checks)
  addRequirementChecks('overlay', properties.overlayTemplates, checks)
  addCapabilityChecks(properties.requires?.capabilities, checks)

  if (workspace && (!existsSync(resolve(workspace)) || !statSync(resolve(workspace)).isDirectory())) {
    checks.push({ severity: 'error', kind: 'workspace', key: workspace, message: 'Workspace path is not a directory.' })
  }
  if (!asArray(properties.entries).length) checks.push({ severity: 'warning', kind: 'entry', key: 'entries', message: 'No app entries declared.' })
  if (!asArray(properties.runtimeTargets).includes('local')) checks.push({ severity: 'warning', kind: 'runtime', key: 'runtimeTargets', message: 'App does not explicitly declare local runtime support.' })
  if (!properties.runtimePackage && isProductLevel(properties)) checks.push({ severity: 'warning', kind: 'runtimePackage', key: 'runtimePackage', required: true, message: 'Product-level apps should declare a runtime package.' })

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

function addCapabilityChecks(capabilities, checks) {
  if (!capabilities || typeof capabilities !== 'object' || Array.isArray(capabilities)) return
  for (const [key, range] of Object.entries(capabilities)) {
    checks.push({
      severity: 'info',
      kind: 'capability',
      key,
      required: true,
      version: range,
      message: `Host must satisfy capability ${key}@${range}.`
    })
  }
}

function checkEntries(entries, properties, findings) {
  for (const entry of asArray(entries)) {
    const key = entry.key || entry.title || 'entry'
    if (!entry.key) findings.push(warningFinding('entries', `Entry is missing key: ${JSON.stringify(entry)}.`))
    if (!entry.kind) findings.push(warningFinding('entries', `Entry is missing kind: ${key}.`))
    if (entry.kind && !currentEntryKinds.has(entry.kind)) {
      if (legacyEntryKinds.has(entry.kind)) {
        findings.push(compatFinding('entries', `Deprecated legacy entry kind for ${key}: ${entry.kind}. Use page, command, workflow, artifact, background-task, or settings for manifestVersion 0.3.`))
        if (String(properties.manifestVersion || '').startsWith('0.3')) findings.push(errorFinding('entries', `entry kind ${entry.kind} is not valid for manifestVersion 0.3: ${key}.`))
      } else {
        findings.push(errorFinding('entries', `Unknown entry kind for ${key}: ${entry.kind}.`))
      }
    }
    if (!entry.title) findings.push(warningFinding('entries', `Entry is missing title: ${key}.`))
    if (entry.kind === 'page' && !entry.route) findings.push(warningFinding('entries', `Page entry is missing route: ${key}.`))
    if (entry.kind === 'panel' && !entry.panel) findings.push(warningFinding('entries', `Panel entry is missing panel id: ${key}.`))
    if (entry.kind === 'command' && !entry.command) findings.push(warningFinding('entries', `Command entry is missing command: ${key}.`))
    if (entry.kind === 'workflow' && !entry.workflow) findings.push(warningFinding('entries', `Workflow entry is missing workflow path or key: ${key}.`))
    if (entry.kind === 'expert-chat' && !entry.persona) findings.push(warningFinding('entries', `Expert-chat entry is missing persona: ${key}.`))
  }
}

function checkProductRuntime(properties, findings) {
  if (!isProductLevel(properties)) return
  if (!properties.runtimePackage) findings.push(warningFinding('runtimePackage', 'Product-level apps should declare runtimePackage so hosts can load UI, worker, storage, and workflow implementation.'))
  if (!asArray(properties.entries).length) findings.push(warningFinding('entries', 'Product-level apps should expose at least one entry.'))
}

function checkExecutablePolicy(properties, findings) {
  const executableEntries = asArray(properties.entries).filter((entry) => ['command', 'workflow', 'background-task'].includes(entry.kind))
  const executableServices = asArray(properties.services).filter((service) => ['worker', 'background-task', 'scheduler', 'tool-adapter'].includes(service.kind))
  const hasPermissions = asArray(properties.permissions).length > 0
  if ((executableEntries.length || executableServices.length || asArray(properties.secrets).length) && !hasPermissions) {
    findings.push(warningFinding('permissions', 'Executable entries, services, or secrets should declare permissions for host policy review.'))
  }
}

function isProductLevel(properties) {
  return ['agent-app', 'workflow-app', 'domain-app', 'customer-app'].includes(properties.appType)
}

function checkDirectoryRefs(appRoot, items, directory, findings) {
  for (const item of asArray(items)) {
    if (!item.path) continue
    const absolute = join(appRoot, item.path)
    if (!existsSync(absolute)) findings.push(warningFinding(directory, `Referenced path does not exist: ${item.path}.`))
  }
}

function checkRuntimePackageRefs(appRoot, runtimePackage, findings) {
  if (!runtimePackage || typeof runtimePackage !== 'object' || Array.isArray(runtimePackage)) return
  for (const [key, value] of Object.entries(runtimePackage)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue
    for (const field of ['path', 'schema', 'migrations']) {
      if (!value[field]) continue
      const absolute = join(appRoot, value[field])
      if (!existsSync(absolute)) findings.push(warningFinding('runtimePackage', `Referenced ${key}.${field} does not exist: ${value[field]}.`))
    }
  }
}

function checkStorageRefs(appRoot, storage, findings) {
  if (!storage || typeof storage !== 'object' || Array.isArray(storage)) return
  for (const field of ['schema', 'migrations']) {
    if (!storage[field]) continue
    const absolute = join(appRoot, storage[field])
    if (!existsSync(absolute)) findings.push(warningFinding('storage', `Referenced ${field} does not exist: ${storage[field]}.`))
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

function hashDirectory(path) {
  const hash = createHash('sha256')
  for (const file of listFiles(path)) {
    const rel = relative(path, file)
    hash.update(rel)
    hash.update('\0')
    hash.update(readFileSync(file))
    hash.update('\0')
  }
  return `sha256:${hash.digest('hex')}`
}

function listFiles(path) {
  const result = []
  for (const entry of readdirSync(path).sort()) {
    if (entry === 'node_modules' || entry === '.git') continue
    const absolute = join(path, entry)
    const stats = statSync(absolute)
    if (stats.isDirectory()) result.push(...listFiles(absolute))
    else result.push(absolute)
  }
  return result
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

function parseVersionFlag(args) {
  const raw = optionValue(args, '--version')
  if (!raw) return undefined
  if (/^0\.3(\.\d+)?$/.test(raw)) return '0.3.0'
  if (/^0\.4(\.\d+)?$/.test(raw)) return '0.4.0'
  if (/^0\.5(\.\d+)?$/.test(raw)) return '0.5.0'
  return raw
}

function checkV05Conventions(appRoot, properties, findings) {
  if (!properties.manifestVersion) {
    findings.push(warningFinding('APP.md', 'manifestVersion is recommended for v0.5 packages.'))
  }
  if (!properties.triggers || (!properties.triggers.keywords && !properties.triggers.scenarios)) {
    findings.push(warningFinding('APP.md', 'v0.5 recommends declaring triggers.keywords or triggers.scenarios for AI auto-discovery.'))
  }
  if (!properties.quickstart || !properties.quickstart.entry) {
    findings.push(warningFinding('APP.md', 'v0.5 recommends declaring quickstart.entry for first-launch UX.'))
  }
  checkV05OpenPlatformMetadata(properties, findings)
  const skillsDir = join(appRoot, 'skills')
  if (existsSync(skillsDir) && statSync(skillsDir).isDirectory()) {
    for (const entry of readdirSync(skillsDir)) {
      const skillRoot = join(skillsDir, entry)
      if (!statSync(skillRoot).isDirectory()) continue
      const skillMd = join(skillRoot, 'SKILL.md')
      if (!existsSync(skillMd)) {
        findings.push(errorFinding(`skills/${entry}/SKILL.md`, 'Bundled Skill must include SKILL.md per Agent Skills standard.'))
      }
    }
  }
}

function checkV05OpenPlatformMetadata(properties, findings) {
  if (!properties.publisher || !properties.publisher.publisherId) {
    findings.push(warningFinding('APP.md', 'v0.5 open-platform: publisher.publisherId is required for catalog identity. Set publisher: { publisherId, name } in the frontmatter.'))
  } else if (!properties.publisher.name) {
    findings.push(warningFinding('APP.md', 'publisher.name is required when publisher.publisherId is set.'))
  }
  if (!properties.displayName) {
    findings.push(warningFinding('APP.md', 'v0.5 catalog: displayName is recommended so launchers can show a human-readable name.'))
  }
  if (!properties.shortDescription) {
    findings.push(warningFinding('APP.md', 'v0.5 catalog: shortDescription is recommended for catalog cards (<= 140 chars).'))
  }
  if (!properties.license) {
    findings.push(warningFinding('APP.md', 'v0.5 open-platform: license is recommended (SPDX id, e.g. Apache-2.0, MIT, UNLICENSED).'))
  }
  if (!properties.homepage && !properties.documentation && !properties.repository) {
    findings.push(warningFinding('APP.md', 'v0.5 open-platform: at least one of homepage / documentation / repository is recommended.'))
  }
  if (!properties.support || (!properties.support.email && !properties.support.url)) {
    findings.push(warningFinding('APP.md', 'v0.5 open-platform: support.email or support.url is recommended for ongoing user support.'))
  }
  if (!properties.updatedAt) {
    findings.push(warningFinding('APP.md', 'v0.5 open-platform: updatedAt (ISO 8601) is recommended so catalogs can sort by freshness.'))
  }
  if (!properties.compliance || !properties.compliance.privacyPolicyUrl) {
    findings.push(warningFinding('APP.md', 'v0.5 open-platform: compliance.privacyPolicyUrl is recommended; users / tenants need to review privacy before install.'))
  }
}

function migrateCheck(appPath, options = []) {
  const appRoot = resolve(appPath)
  const findings = []
  if (!existsSync(appRoot) || !statSync(appRoot).isDirectory()) {
    findings.push(errorFinding('.', 'App path is not a directory.'))
    return envelope(false, 'failed', 'migrate-check', basename(appRoot), findings)
  }
  const appMd = join(appRoot, 'APP.md')
  if (!existsSync(appMd)) {
    findings.push(errorFinding('APP.md', 'Missing required APP.md.'))
    return envelope(false, 'failed', 'migrate-check', basename(appRoot), findings)
  }
  const properties = readAppProperties(appMd)
  const target = parseVersionFlag(options) || '0.5.0'
  const sourceVersion = properties.manifestVersion || '0.3.0'
  const gaps = []

  if (sourceVersion === target) {
    findings.push({ severity: 'info', path: 'APP.md', message: `Already on manifestVersion ${target}. No migration required.` })
  }

  if (target === '0.5.0') {
    if (!properties.triggers) gaps.push({ field: 'triggers', suggestion: 'Add triggers.keywords and triggers.scenarios to APP.md frontmatter.' })
    if (!properties.quickstart) gaps.push({ field: 'quickstart', suggestion: 'Add quickstart.entry pointing to a default entry key.' })
    if (!properties.skills) gaps.push({ field: 'skills', suggestion: 'Move skillRefs into skills.bundled / skills.references and add SKILL.md under skills/.' })
    for (const file of v05LayeredFiles) {
      if (!existsSync(join(appRoot, file))) {
        gaps.push({ field: file, suggestion: `Create ${file} for layered v0.5 configuration.` })
      }
    }
    const localesDir = join(appRoot, 'locales')
    if (!existsSync(localesDir)) {
      gaps.push({ field: 'locales/', suggestion: 'Add locales/ directory with translation files for supported locales.' })
    }
  }

  return envelope(gaps.length === 0, gaps.length === 0 ? 'ready' : 'needs-setup', 'migrate-check', basename(appRoot), findings, {
    sourceVersion,
    targetVersion: target,
    gaps
  })
}

function migrateGenerate(appPath, options = []) {
  const appRoot = resolve(appPath)
  if (!existsSync(appRoot) || !statSync(appRoot).isDirectory()) {
    return envelope(false, 'failed', 'migrate-generate', basename(appRoot), [errorFinding('.', 'App path is not a directory.')])
  }
  const appMd = join(appRoot, 'APP.md')
  if (!existsSync(appMd)) {
    return envelope(false, 'failed', 'migrate-generate', basename(appRoot), [errorFinding('APP.md', 'Missing required APP.md.')])
  }
  const properties = readAppProperties(appMd)
  const target = parseVersionFlag(options) || '0.5.0'
  const suggestions = {}

  if (target === '0.5.0') {
    suggestions['APP.md.frontmatter'] = {
      manifestVersion: '0.5.0',
      triggers: properties.triggers || {
        keywords: [properties.appType || 'agent-app', properties.name || 'app'].filter(Boolean),
        scenarios: []
      },
      quickstart: properties.quickstart || {
        entry: pickDefaultEntry(properties.entries) || 'dashboard'
      }
    }
    suggestions['app.errors.yaml'] = sampleErrorsYaml()
    suggestions['app.i18n.yaml'] = sampleI18nYaml()
    suggestions['evals/readiness.yaml'] = sampleReadinessYaml()
    suggestions['evals/health.yaml'] = sampleHealthYaml()
    suggestions['app.signature.yaml'] = sampleSignatureYaml(properties.name || 'app', properties.version || '0.5.0')
  }

  return envelope(true, 'ready', 'migrate-generate', basename(appRoot), [], {
    sourceVersion: properties.manifestVersion || '0.3.0',
    targetVersion: target,
    suggestions
  })
}

function pickDefaultEntry(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return undefined
  const page = entries.find(entry => entry && entry.kind === 'page')
  return page?.key || entries[0]?.key
}

function sampleErrorsYaml() {
  return [
    'errors:',
    '  CAPABILITY_NOT_AVAILABLE:',
    '    code: APP_E001',
    '    message: Required capability is not available',
    '    recovery: Check Lime version and capability configuration',
    '    userAction: Ask an admin to enable the capability',
    '    retryable: false'
  ].join('\n')
}

function sampleI18nYaml() {
  return [
    'i18n:',
    '  defaultLocale: en-US',
    '  supportedLocales: [zh-CN, zh-TW, en-US, ja-JP, ko-KR]',
    '  translations:',
    '    en-US: ./locales/en-US.json'
  ].join('\n')
}

function sampleReadinessYaml() {
  return [
    'readiness:',
    '  required:',
    '    - check: sdk_version',
    '      expect: ">=0.5.0"',
    '      blocker: true',
    '      message: Lime SDK v0.5.0 or higher is required',
    '  recommended: []',
    '  performance: []'
  ].join('\n')
}

function sampleHealthYaml() {
  return [
    'health:',
    '  startup:',
    '    - check: sdk_connection',
    '      timeout: 5s',
    '      critical: true',
    '  runtime: []',
    '  metrics: []'
  ].join('\n')
}

function sampleSignatureYaml(appName, appVersion) {
  return [
    'signature:',
    '  package:',
    '    algorithm: sha256',
    '    hash: REPLACE_WITH_REAL_SHA256',
    `    signedBy: sigstore`,
    `    signatureRef: sigstore:${appName}@${appVersion}`,
    '  manifest:',
    '    algorithm: sha256',
    '    hash: REPLACE_WITH_REAL_SHA256',
    '  trust:',
    '    publisher: REPLACE_WITH_PUBLISHER',
    '    publisherId: REPLACE_WITH_PUBLISHER_ID',
    '  revocation:',
    '    checkUrl: https://revoke.example.com/check',
    '    cacheSeconds: 3600'
  ].join('\n')
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

function compatFinding(path, message) {
  return { severity: 'warning', code: 'deprecated-compat', path, message }
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
