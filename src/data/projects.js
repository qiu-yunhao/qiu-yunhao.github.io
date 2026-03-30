import blogProcessContent from '@/content/projects/personal-blog/process.md?raw'
import blogStructureContent from '@/content/projects/personal-blog/structure.md?raw'
import practiceOverviewContent from '@/content/projects/practice-lab/overview.md?raw'
import practiceResponsiveContent from '@/content/projects/practice-lab/responsive-notes.md?raw'

export const projects = [
  {
    slug: 'personal-blog',
    nameKey: 'projectItems.personalBlog.name',
    descriptionKey: 'projectItems.personalBlog.description',
    stacks: ['Vue 3', 'Vite', 'Vue Router'],
    githubUrl: 'https://github.com/your-name/personal-blog',
    readmeUrl:
      'https://raw.githubusercontent.com/your-name/personal-blog/main/README.md',
    docs: [
      {
        slug: 'readme',
        label: 'README',
        source: 'remote',
        url: 'https://raw.githubusercontent.com/your-name/personal-blog/main/README.md',
        description: 'GitHub 仓库中的主说明文档。',
      },
      {
        slug: 'process',
        label: '搭建过程',
        source: 'local',
        content: blogProcessContent,
        description: '记录从初始化到页面拆分的实际推进过程。',
      },
      {
        slug: 'structure',
        label: '结构设计',
        source: 'local',
        content: blogStructureContent,
        description: '整理项目目录、页面职责和后续扩展方向。',
      },
    ],
  },
  {
    slug: 'practice-lab',
    nameKey: 'projectItems.practiceLab.name',
    descriptionKey: 'projectItems.practiceLab.description',
    stacks: ['JavaScript', 'CSS', 'Responsive'],
    githubUrl: 'https://github.com/your-name/practice-lab',
    readmeUrl:
      'https://raw.githubusercontent.com/your-name/practice-lab/main/README.md',
    docs: [
      {
        slug: 'readme',
        label: 'README',
        source: 'remote',
        url: 'https://raw.githubusercontent.com/your-name/practice-lab/main/README.md',
        description: '项目的总体说明和使用方式。',
      },
      {
        slug: 'overview',
        label: '练习目标',
        source: 'local',
        content: practiceOverviewContent,
        description: '这类练习项目主要解决什么问题、怎么安排模块。',
      },
      {
        slug: 'responsive-notes',
        label: '响应式记录',
        source: 'local',
        content: practiceResponsiveContent,
        description: '整理移动端和桌面端适配时踩过的点。',
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
