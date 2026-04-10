import blogProcessContent from '@/content/projects/personal-blog/process.md?raw'
import blogStructureContent from '@/content/projects/personal-blog/structure.md?raw'
import weatherOverviewContent from '@/content/projects/weather/overview.md?raw'
import weatherRequirementsContent from '@/content/projects/weather/requirements.md?raw'
import weatherArchitectureContent from '@/content/projects/weather/architecture.md?raw'
import easyGameOverviewContent from '@/content/projects/easy-game/overview.md?raw'
import easyGameRuntimeFlowContent from '@/content/projects/easy-game/runtime-flow.md?raw'
import easyGameRunningNotesContent from '@/content/projects/easy-game/running-notes.md?raw'

export const projects = [
  {
    slug: 'personal-blog',
    nameKey: 'projectItems.personalBlog.name',
    descriptionKey: 'projectItems.personalBlog.description',
    stacks: ['Vue 3', 'Vite', 'Vue Router'],
    githubUrl: 'https://github.com/your-name/personal-blog',
    readmeUrl: 'https://raw.githubusercontent.com/your-name/personal-blog/main/README.md',
    docs: [
      {
        slug: 'readme',
        label: 'README',
        source: 'remote',
        url: 'https://raw.githubusercontent.com/your-name/personal-blog/main/README.md',
        description: '保留仓库原始 README，方便对照项目代码与线上展示。',
      },
      {
        slug: 'process',
        label: '开发过程',
        source: 'local',
        content: blogProcessContent,
        description: '记录博客从想法到页面落地过程中的关键取舍与迭代。',
      },
      {
        slug: 'structure',
        label: '结构说明',
        source: 'local',
        content: blogStructureContent,
        description: '拆解当前博客的内容组织、页面结构与展示策略。',
      },
    ],
  },
  {
    slug: 'weather',
    name: 'Weather',
    description:
      '一个基于 Jetpack Compose 的原生 Android 天气应用，覆盖天气查询、城市管理、定位识别、本地缓存、主题切换与多语言体验。',
    stacks: ['Kotlin', 'Jetpack Compose', 'Android', 'Room', 'Hilt'],
    githubUrl: 'https://github.com/qiu-yunhao/weather',
    readmeUrl: 'https://raw.githubusercontent.com/qiu-yunhao/weather/main/README.md',
    docs: [
      {
        slug: 'overview',
        label: '项目概览',
        source: 'local',
        content: weatherOverviewContent,
        description: '介绍项目定位、核心能力、技术方向和作品集视角下的展示重点。',
      },
      {
        slug: 'requirements',
        label: '需求分析',
        source: 'local',
        content: weatherRequirementsContent,
        description: '梳理目标用户、典型场景、功能范围和本项目的设计取舍。',
      },
      {
        slug: 'architecture',
        label: '架构设计',
        source: 'local',
        content: weatherArchitectureContent,
        description: '说明 data、domain、presentation 三层分工和主要数据流组织方式。',
      },
      {
        slug: 'readme',
        label: 'README',
        source: 'remote',
        url: 'https://raw.githubusercontent.com/qiu-yunhao/weather/main/README.md',
        description: '保留仓库原始 README，方便查看完整说明、截图和工程细节。',
      },
    ],
  },
  {
    slug: 'easy-game',
    name: 'easy_game',
    description:
      '一个面向修仙题材互动叙事的 Python 项目，用 Graph 编排剧情规划、角色行动、导演调度、玩家输入解析、旁白生成、记忆压缩和存档查询。',
    stacks: ['Python', 'LLM Agent', 'LangGraph', 'SQLAlchemy', 'Web UI'],
    githubUrl: 'https://github.com/qiu-yunhao/easy_game',
    readmeUrl: 'https://raw.githubusercontent.com/qiu-yunhao/easy_game/main/README.md',
    docs: [
      {
        slug: 'overview',
        label: '项目概览',
        source: 'local',
        content: easyGameOverviewContent,
        description: '介绍 easy_game 的项目定位、核心能力、模块拆分和作品集展示重点。',
      },
      {
        slug: 'runtime-flow',
        label: '运行流程',
        source: 'local',
        content: easyGameRuntimeFlowContent,
        description: '梳理 GameState、Graph 子图、一轮故事推进和 Agent 回退逻辑。',
      },
      {
        slug: 'running-notes',
        label: '运行与测试',
        source: 'local',
        content: easyGameRunningNotesContent,
        description: '整理运行模式、依赖安装、命令行 Demo、Web Demo、工具系统和测试覆盖。',
      },
      {
        slug: 'readme',
        label: 'README',
        source: 'remote',
        url: 'https://raw.githubusercontent.com/qiu-yunhao/easy_game/main/README.md',
        description: '保留仓库原始 README，方便对照项目代码与最新说明。',
      },
    ],
  },
]

export const getProjectBySlug = (slug) => projects.find((project) => project.slug === slug)

export const getProjectDoc = (project, docSlug) => {
  if (!project) {
    return null
  }

  if (!docSlug) {
    return project.docs[0] ?? null
  }

  return project.docs.find((doc) => doc.slug === docSlug) ?? project.docs[0] ?? null
}
