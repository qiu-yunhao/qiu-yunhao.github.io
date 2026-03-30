export default {
  nav: {
    home: 'Home',
    posts: 'Posts',
    projects: 'Projects',
    about: 'About',
    theme: 'Theme',
    language: 'Language',
  },
  footer: {
    builtWith: 'Built with Vue 3.',
  },
  language: {
    zhCN: '中',
    enUS: 'EN',
  },
  themes: {
    default: 'Sea Blue',
    forest: 'Forest',
    sunset: 'Sunset',
  },
  home: {
    hero: {
      eyebrow: 'PERSONAL TECH BLOG',
      title: 'A simple place to record how I meet the world.',
      description: 'This is where I collect study notes, project summaries, and lessons learned from mistakes.',
      primaryAction: 'Read Posts',
      secondaryAction: 'View Projects',
    },
    focusCard: {
      label: 'Now',
      title: 'Current Focus',
      items: ['Building the blog', 'Deploying to GitHub Pages', 'Cleaning up components and page structure'],
    },
    latestPosts: {
      eyebrow: 'LATEST POSTS',
      title: 'Latest Posts',
      action: 'View All',
    },
    featuredProjects: {
      eyebrow: 'FEATURED PROJECTS',
      title: 'Featured Work',
      action: 'More Projects',
    },
    techStack: {
      eyebrow: 'TECH STACK',
      title: 'Current Stack',
      description: 'These are the tools I practice with most often and write about the most.',
    },
  },
  about: {
    title: 'About Me',
    lead: 'I am a front-end learner growing my Vue 3, engineering, and interface design skills through real projects.',
    currentFocusTitle: 'Current Focus',
    currentFocusText: 'Vue 3, JavaScript, CSS, and front-end engineering.',
    contactTitle: 'Contact',
    contactLead: 'These are the channels where people can reach you. Replace the sample values with your own details.',
    galleryTitle: 'Moments',
    galleryLead: 'Click any image card to open a separate detail page.',
    detailBack: 'Back to About',
    detailMore: 'More Moments',
    openDetail: 'View Detail',
  },
  contact: {
    qq: 'QQ',
    phone: 'Phone',
    email: 'Email',
    wechat: 'WeChat',
  },
  postsPage: {
    title: 'Posts',
    lead: 'This page collects my technical writing, study notes, and debugging logs.',
    filters: {
      all: 'All',
      vue: 'Vue 3',
      engineering: 'Engineering',
      deploy: 'Deploy',
    },
  },
  projectsPage: {
    title: 'Projects',
    lead: 'This page showcases my project practice, stack choices, and implementation highlights.',
    blogTitle: 'Personal Tech Blog',
    blogText: 'Built with Vue 3 and Vite, with GitHub Pages deployment planned next.',
    moreTitle: 'More Projects',
    moreText: 'I will add GitHub links, live previews, and project retrospectives here later.',
  },
  notFound: {
    lead: 'The page you requested does not exist. It may have moved or the URL may be incorrect.',
    action: 'Back Home',
  },
  postItems: {
    buildBlog: {
      title: 'Building a blog from scratch with Vue 3',
      description: 'A walkthrough of setting up the project, breaking down the layout, and shaping the base blog structure.',
    },
    deployNotes: {
      title: 'GitHub Pages deployment notes',
      description: 'A short summary of common path configuration and refresh issues when deploying a static site.',
    },
    tags: {
      vue: 'Vue 3',
      vite: 'Vite',
      pages: 'GitHub Pages',
      deploy: 'Deploy',
    },
  },
  projectItems: {
    personalBlog: {
      name: 'Personal Tech Blog',
      description: 'A personal blog built with Vue 3 and Vite, with GitHub Pages deployment planned next.',
    },
    practiceLab: {
      name: 'Frontend Practice Project',
      description: 'A sandbox for practicing layout splitting, component design, and responsive UI work.',
    },
  },
  aboutGallery: {
    hero: {
      title: 'Hero Image',
      caption: 'Replace this with the image that represents you best.',
      detail:
        'This spot works well for a signature image that captures your personality, such as a portrait, a desk setup, your favorite devices, or a place from daily life.',
    },
    study: {
      title: 'Study Session',
      caption: 'A good place for coding, note-taking, or project-building scenes.',
      detail:
        'Desk photos, notes, keyboards, monitors, and all the little details of your study routine fit naturally here and make your learning process feel tangible.',
    },
    hobby: {
      title: 'Hobby Snapshot',
      caption: 'Use this to show your interests and make the page feel more personal.',
      detail:
        'This section does not need to be technical. Sports, reading, photography, travel, or any everyday moment that reflects your pace and taste will work well.',
    },
    work: {
      title: 'Work Showcase',
      caption: 'You can also place project screenshots, interface mockups, or creative work here.',
      detail:
        'If you want the about page to lean a bit more portfolio-like, this is a strong place for product screenshots, UI fragments, design drafts, diagrams, or other work samples.',
    },
  },
}
