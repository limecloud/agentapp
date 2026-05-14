import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'

const enNav = [
  { text: 'Guide', link: '/en/what-is-agent-app' },
  { text: 'Specification', link: '/en/specification' },
  { text: 'Examples', link: '/en/examples/content-engineering' },
  { text: 'Ecosystem', link: '/en/reference/agent-ecosystem' },
  {
    text: 'Version',
    items: [
      { text: 'latest', link: '/en/specification' },
      { text: 'v0.1 overview', link: '/en/versions/v0.1/overview' },
      { text: 'v0.1 specification', link: '/en/versions/v0.1/specification' },
      { text: 'v0.1 changelog', link: '/en/versions/v0.1/changelog' }
    ]
  },
  { text: 'GitHub', link: 'https://github.com/limecloud/agentapp' }
]

const zhNav = [
  { text: '指南', link: '/zh/what-is-agent-app' },
  { text: '规范', link: '/zh/specification' },
  { text: '示例', link: '/zh/examples/content-engineering' },
  { text: '生态', link: '/zh/reference/agent-ecosystem' },
  {
    text: '版本',
    items: [
      { text: 'latest', link: '/zh/specification' },
      { text: 'v0.1 概览', link: '/zh/versions/v0.1/overview' },
      { text: 'v0.1 规范', link: '/zh/versions/v0.1/specification' },
      { text: 'v0.1 变更记录', link: '/zh/versions/v0.1/changelog' }
    ]
  },
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
      { text: 'Description and discovery', link: '/en/authoring/description-and-discovery' },
      { text: 'Manifest design', link: '/en/authoring/manifest-design' },
      { text: 'Best practices', link: '/en/authoring/best-practices' },
      { text: 'App engineering loop', link: '/en/authoring/app-engineering-loop' },
      { text: 'Skills and Knowledge interop', link: '/en/authoring/skills-knowledge-interop' },
      { text: 'Permissions and policy', link: '/en/authoring/permissions-and-policy' },
      { text: 'Overlay model', link: '/en/authoring/overlay-model' },
      { text: 'Readiness and evals', link: '/en/authoring/readiness-and-evals' },
      { text: 'Release and distribution', link: '/en/authoring/release-and-distribution' }
    ]
  },
  {
    text: 'For client implementors',
    items: [
      { text: 'Adding support', link: '/en/client-implementation/adding-support' },
      { text: 'Discovery and installation', link: '/en/client-implementation/discovery-and-installation' },
      { text: 'Runtime model', link: '/en/client-implementation/runtime-model' },
      { text: 'Projection and catalog', link: '/en/client-implementation/projection-and-catalog' },
      { text: 'Overlay resolver', link: '/en/client-implementation/overlay-resolver' },
      { text: 'Readiness runner', link: '/en/client-implementation/readiness-runner' },
      { text: 'Security model', link: '/en/client-implementation/security-model' }
    ]
  },
  {
    text: 'Examples',
    items: [
      { text: 'AI content engineering app', link: '/en/examples/content-engineering' },
      { text: 'Customer support app', link: '/en/examples/customer-support' },
      { text: 'Complete APP.md', link: '/en/examples/complete-app' }
    ]
  },
  {
    text: 'Reference',
    items: [
      { text: 'Mini-program analogy', link: '/en/reference/mini-program-analogy' },
      { text: 'Reference CLI', link: '/en/reference/reference-cli' },
      { text: 'JSON Schemas', link: '/en/reference/json-schemas' },
      { text: 'Glossary', link: '/en/reference/glossary' },
      { text: 'Agent standards ecosystem', link: '/en/reference/agent-ecosystem' }
    ]
  },
  {
    text: 'Versions',
    items: [
      { text: 'v0.1 overview', link: '/en/versions/v0.1/overview' },
      { text: 'v0.1 specification', link: '/en/versions/v0.1/specification' },
      { text: 'v0.1 changelog', link: '/en/versions/v0.1/changelog' }
    ]
  }
]

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
      { text: '描述与发现', link: '/zh/authoring/description-and-discovery' },
      { text: 'Manifest 设计', link: '/zh/authoring/manifest-design' },
      { text: '最佳实践', link: '/zh/authoring/best-practices' },
      { text: '应用工程闭环', link: '/zh/authoring/app-engineering-loop' },
      { text: 'Skills / Knowledge 互操作', link: '/zh/authoring/skills-knowledge-interop' },
      { text: '权限与 Policy', link: '/zh/authoring/permissions-and-policy' },
      { text: 'Overlay 模型', link: '/zh/authoring/overlay-model' },
      { text: 'Readiness 与评估', link: '/zh/authoring/readiness-and-evals' },
      { text: '发布与分发', link: '/zh/authoring/release-and-distribution' }
    ]
  },
  {
    text: '客户端实现者',
    items: [
      { text: '接入支持', link: '/zh/client-implementation/adding-support' },
      { text: '发现与安装', link: '/zh/client-implementation/discovery-and-installation' },
      { text: '运行时模型', link: '/zh/client-implementation/runtime-model' },
      { text: '投影与目录', link: '/zh/client-implementation/projection-and-catalog' },
      { text: 'Overlay Resolver', link: '/zh/client-implementation/overlay-resolver' },
      { text: 'Readiness Runner', link: '/zh/client-implementation/readiness-runner' },
      { text: '安全模型', link: '/zh/client-implementation/security-model' }
    ]
  },
  {
    text: '示例',
    items: [
      { text: 'AI 内容工程化应用', link: '/zh/examples/content-engineering' },
      { text: '客服知识库应用', link: '/zh/examples/customer-support' },
      { text: '完整 APP.md', link: '/zh/examples/complete-app' }
    ]
  },
  {
    text: '参考',
    items: [
      { text: '小程序类比', link: '/zh/reference/mini-program-analogy' },
      { text: '参考 CLI', link: '/zh/reference/reference-cli' },
      { text: 'JSON Schemas', link: '/zh/reference/json-schemas' },
      { text: '术语表', link: '/zh/reference/glossary' },
      { text: 'Agent 标准生态', link: '/zh/reference/agent-ecosystem' }
    ]
  },
  {
    text: '版本',
    items: [
      { text: 'v0.1 概览', link: '/zh/versions/v0.1/overview' },
      { text: 'v0.1 规范', link: '/zh/versions/v0.1/specification' },
      { text: 'v0.1 变更记录', link: '/zh/versions/v0.1/changelog' }
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

export default defineConfig({
  title: 'Agent App',
  description: 'Installable agent application packages.',
  base,
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#3157d5' }]
  ],
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
    siteTitle: 'Agent App',
    nav: [
      { text: 'English', link: '/en/' },
      { text: '简体中文', link: '/zh/' }
    ],
    sidebar: [],
    search: { provider: 'local' },
    footer: {
      message: 'Draft host-platform standard for installable agent applications.',
      copyright: 'Released for discussion and implementation.'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/limecloud/agentapp' }
    ]
  },
  locales: {
    root: {
      label: 'Start',
      lang: 'en-US',
      title: 'Agent App',
      description: 'Installable agent application packages.',
      themeConfig: {
        nav: [
          { text: 'English', link: '/en/' },
          { text: '简体中文', link: '/zh/' }
        ],
        sidebar: []
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Agent App',
      description: 'Installable agent application packages.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        editLink: {
          pattern: 'https://github.com/limecloud/agentapp/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        }
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Agent App',
      description: '面向 Agent 的可安装应用包标准。',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        editLink: {
          pattern: 'https://github.com/limecloud/agentapp/edit/main/docs/:path',
          text: '在 GitHub 编辑本页'
        }
      }
    }
  }
})
