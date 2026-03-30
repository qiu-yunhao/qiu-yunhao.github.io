export default {
  nav: {
    home: '首页',
    posts: '文章',
    projects: '项目',
    about: '关于',
    theme: '主题',
    language: '语言',
  },
  footer: {
    builtWith: '基于 Vue 3 构建。',
  },
  language: {
    zhCN: '中',
    enUS: 'EN',
  },
  themes: {
    default: '海盐蓝',
    forest: '青林绿',
    sunset: '落日橙',
  },
  home: {
    hero: {
      eyebrow: 'PERSONAL TECH BLOG',
      title: '简单记录一下我和这个世界的相遇。',
      description: '这里会放我的学习笔记、项目总结和一路踩坑后的整理。',
      primaryAction: '看文章',
      secondaryAction: '看项目',
    },
    focusCard: {
      label: '现在',
      title: '当前聚焦',
      items: ['博客搭建', 'GitHub Pages 部署', '组件化与页面结构整理'],
    },
    latestPosts: {
      eyebrow: 'LATEST POSTS',
      title: '最新文章',
      action: '查看全部',
    },
    featuredProjects: {
      eyebrow: 'FEATURED PROJECTS',
      title: '来点儿项目',
      action: '更多项目',
    },
    techStack: {
      eyebrow: 'TECH STACK',
      title: '当前技术栈',
      description: '这些是我目前重点练习和输出内容最多的方向。',
    },
  },
  about: {
    title: '关于我',
    lead: '我是一名前端学习者，正在通过真实项目提升 Vue 3、工程化和页面设计能力。',
    currentFocusTitle: '当前方向',
    currentFocusText: 'Vue 3、JavaScript、CSS、前端工程化。',
    contactTitle: '联系我',
    contactLead: '这里放常用联系方式。后面你只需要把示例值替换成你自己的信息即可。',
    galleryTitle: '生活片段',
    galleryLead: '点击任意图片卡片，可以进入单独详情页查看更多内容。',
    detailBack: '返回关于页',
    detailMore: '更多片段',
    openDetail: '查看详情',
  },
  contact: {
    qq: 'QQ',
    phone: '电话',
    email: '邮箱',
    wechat: '微信',
  },
  postsPage: {
    title: '文章',
    lead: '这里会展示我的技术文章、学习笔记和踩坑记录。',
    filters: {
      all: '全部',
      vue: 'Vue 3',
      engineering: '工程化',
      deploy: '部署',
    },
  },
  projectsPage: {
    title: '项目',
    lead: '这里会展示我的项目实践、技术栈和实现亮点。',
    blogTitle: '个人技术博客',
    blogText: '基于 Vue 3 和 Vite 构建，计划部署到 GitHub Pages。',
    moreTitle: '更多项目',
    moreText: '后续这里会补充 GitHub 链接、在线预览和项目复盘。',
  },
  notFound: {
    lead: '你访问的页面不存在，可能已经被移动或地址输入错误。',
    action: '返回首页',
  },
  postItems: {
    buildBlog: {
      title: '用 Vue 3 从零开始搭博客',
      description: '记录从项目初始化、页面拆分到博客结构搭建的一次完整练习。',
    },
    deployNotes: {
      title: 'GitHub Pages 部署踩坑记录',
      description: '整理部署静态站点时常见的路径配置和刷新问题。',
    },
    tags: {
      vue: 'Vue 3',
      vite: 'Vite',
      pages: 'GitHub Pages',
      deploy: '部署',
    },
  },
  projectItems: {
    personalBlog: {
      name: '个人技术博客',
      description: '使用 Vue 3 和 Vite 构建的个人技术博客，后续会部署到 GitHub Pages。',
    },
    practiceLab: {
      name: '前端练习项目',
      description: '用于练习页面结构拆分、组件化设计和响应式布局。',
    },
  },
  aboutGallery: {
    hero: {
      title: '主展示图',
      caption: '建议替换成一张最能代表你的主图。',
      detail:
        '这里适合放一张最能体现你个人气质的照片，比如个人肖像、工作台、常用设备，或者你最喜欢的一处生活场景。',
    },
    study: {
      title: '学习现场',
      caption: '可以放写代码、记笔记、做项目时的场景。',
      detail:
        '如果你有书桌、显示器、笔记本、草稿本之类的照片，放在这里会很自然，也能让访客更直观地感受到你的学习状态。',
    },
    hobby: {
      title: '兴趣片段',
      caption: '适合补充你的兴趣爱好，让页面更有个人感。',
      detail:
        '这一块可以不那么“技术”，可以是运动、摄影、阅读、出行，或者任何能表现你日常节奏和审美偏好的内容。',
    },
    work: {
      title: '作品相关',
      caption: '也可以放项目截图、界面设计或你的创作内容。',
      detail:
        '如果你希望关于页更偏作品集风格，这里很适合放项目截图、设计稿、页面局部、流程图等素材，形成“人和作品”同时被看到的感觉。',
    },
  },
}
