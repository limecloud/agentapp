import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'

const enNav = [
  { text: 'Guide', link: '/en/what-is-agent-app' },
  { text: 'Specification', link: '/en/specification' },
  { text: 'Examples', link: '/en/examples/content-engineering' },
  { text: 'Ecosystem', link: '/en/reference/agent-ecosystem' },
  { text: 'GitHub', link: 'https://github.com/limecloud/agentapp' }
]

const zhNav = [
  { text: '指南', link: '/zh/what-is-agent-app' },
  { text: '规范', link: '/zh/specification' },
  { text: '示例', link: '/zh/examples/content-engineering' },
  { text: '生态', link: '/zh/reference/agent-ecosystem' },
  { text: 'GitHub', link: 'https://github.com/limecloud/agentapp' }
]

const enSidebar = [
  {
    text: 'Start here',
    items: [
      { text: 'Overview', link: '/en/' },
      { text: 'What is Agent App?', link: '/en/what-is-agent-app' },
      { text: 'App vs Skills and Knowledge', link: '/en/agent-app-vs-skills-knowledge' },
      { text: 'Specification', link: '/en/specification' }
    ]
  },
  {
    text: 'For app authors',
    items: [
      { text: 'Quickstart', link: '/en/authoring/quickstart' },
      { text: 'Manifest design', link: '/en/authoring/manifest-design' },
      { text: 'Overlay model', link: '/en/authoring/overlay-model' },
      { text: 'Readiness and evals', link: '/en/authoring/readiness-and-evals' }
    ]
  },
  {
    text: 'For client implementors',
    items: [
      { text: 'Adding support', link: '/en/client-implementation/adding-support' },
      { text: 'Runtime model', link: '/en/client-implementation/runtime-model' },
      { text: 'Projection and catalog', link: '/en/client-implementation/projection-and-catalog' },
      { text: 'Security model', link: '/en/client-implementation/security-model' }
    ]
  },
  {
    text: 'Examples',
    items: [
      { text: 'AI content engineering app', link: '/en/examples/content-engineering' },
      { text: 'Customer support app', link: '/en/examples/customer-support' }
    ]
  },
  {
    text: 'Reference',
    items: [
      { text: 'Reference CLI', link: '/en/reference/reference-cli' },
      { text: 'Glossary', link: '/en/reference/glossary' },
      { text: 'Agent standards ecosystem', link: '/en/reference/agent-ecosystem' }
    ]
  }
]


function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '&#10;')
}


const zhSidebar = [
  {
    text: '开始',
    items: [
      { text: '概览', link: '/zh/' },
      { text: '什么是 Agent App', link: '/zh/what-is-agent-app' },
      { text: 'App 与 Skills / Knowledge 的边界', link: '/zh/agent-app-vs-skills-knowledge' },
      { text: '规范', link: '/zh/specification' }
    ]
  },
  {
    text: '应用作者',
    items: [
      { text: '快速开始', link: '/zh/authoring/quickstart' },
      { text: 'Manifest 设计', link: '/zh/authoring/manifest-design' },
      { text: 'Overlay 模型', link: '/zh/authoring/overlay-model' },
      { text: 'Readiness 与评估', link: '/zh/authoring/readiness-and-evals' }
    ]
  },
  {
    text: '客户端实现者',
    items: [
      { text: '接入支持', link: '/zh/client-implementation/adding-support' },
      { text: '运行时模型', link: '/zh/client-implementation/runtime-model' },
      { text: '投影与目录', link: '/zh/client-implementation/projection-and-catalog' },
      { text: '安全模型', link: '/zh/client-implementation/security-model' }
    ]
  },
  {
    text: '示例',
    items: [
      { text: 'AI 内容工程化应用', link: '/zh/examples/content-engineering' },
      { text: '客服知识库应用', link: '/zh/examples/customer-support' }
    ]
  },
  {
    text: '参考',
    items: [
      { text: '参考 CLI', link: '/zh/reference/reference-cli' },
      { text: '术语表', link: '/zh/reference/glossary' },
      { text: 'Agent 标准生态', link: '/zh/reference/agent-ecosystem' }
    ]
  }
]

export default defineConfig({
  title: 'Agent App',
  description: 'Installable agent application packages.',
  base,
  cleanUrls: true,
  ignoreDeadLinks: true,
  markdown: {
    config(md) {
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = token.info.trim()
        if (info === 'mermaid') {
          return `<MermaidDiagram code="${escapeHtmlAttribute(token.content)}" />`
        }
        return defaultFence ? defaultFence(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
      }
    }
  },
  themeConfig: {
    logo: '/favicon.svg',
    search: { provider: 'local' },
    locales: {
      root: { label: 'English', lang: 'en-US', nav: enNav, sidebar: enSidebar },
      zh: { label: '简体中文', lang: 'zh-CN', nav: zhNav, sidebar: zhSidebar }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/limecloud/agentapp' }
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'Agent App',
      description: 'Installable agent application packages.'
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Agent App',
      description: '面向 Agent 的可安装应用包标准。'
    }
  }
})
