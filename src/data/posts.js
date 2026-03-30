import hexoPost1Content from '../content/posts/菜鸡组会分享.md?raw'
import hexoPost2Content from '../content/posts/动态规划.md?raw'
import hexoPost3Content from '../content/posts/观察者模式.md?raw'
import hexoPost4Content from '../content/posts/古典密码.md?raw'
import hexoPost5Content from '../content/posts/杂乱无章.md?raw'
import view1Content from '../content/posts/view-1.md?raw'
import animatorContent from '../content/posts/animator.md?raw'
import base64Content from '../content/posts/base64.md?raw'
import cContent from '../content/posts/c.md?raw'
import cryptoContent from '../content/posts/crypto.md?raw'
import iosContent from '../content/posts/ios.md?raw'
import roomContent from '../content/posts/room.md?raw'

const getPostTimestamp = (post) => {
  if (!post.date) {
    return Number.NEGATIVE_INFINITY
  }

  const timestamp = Date.parse(post.date)
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp
}


export const posts = [
  {
    slug: '菜鸡组会分享',
    title: '菜鸡组会分享',
    description: '菜鸡组会分享 的迁移文章',
    date: '2021-06-11',
    category: 'Archive',
    tags: ['android'],
    content: hexoPost1Content,
  },
  {
    slug: '动态规划',
    title: '动态规划',
    description: '动态规划 的迁移文章',
    date: '',
    category: 'Archive',
    tags: [],
    content: hexoPost2Content,
  },
  {
    slug: '观察者模式',
    title: '观察者模式',
    description: '观察者模式 的迁移文章',
    date: '',
    category: 'Archive',
    tags: [],
    content: hexoPost3Content,
  },
  {
    slug: '古典密码',
    title: '古典密码',
    description: '古典密码 的迁移文章',
    date: '2020-12-14',
    category: 'Archive',
    tags: ['-密码'],
    content: hexoPost4Content,
  },
  {
    slug: '杂乱无章',
    title: '杂乱无章',
    description: '杂乱无章 的迁移文章',
    date: '2021-10-30',
    category: 'Archive',
    tags: ['c', 'android'],
    content: hexoPost5Content,
  },
  {
    slug: 'view-1',
    title: 'Android 自定义View--定制图表',
    description: 'Android 自定义View--定制图表 的迁移文章',
    date: '2022-02-25',
    category: 'Archive',
    tags: ['Android&&自定义View'],
    content: view1Content,
  },
  {
    slug: 'animator',
    title: 'Animator相关介绍',
    description: 'Animator相关介绍 的迁移文章',
    date: '',
    category: 'Archive',
    tags: [],
    content: animatorContent,
  },
  {
    slug: 'base64',
    title: 'base64',
    description: 'base64 的迁移文章',
    date: '2021-04-06',
    category: 'Archive',
    tags: ['密码'],
    content: base64Content,
  },
  {
    slug: 'c',
    title: 'C语言指针（代传）',
    description: 'C语言指针（代传） 的迁移文章',
    date: '2021-10-30',
    category: 'Archive',
    tags: ['C', '帮大佬代传'],
    content: cContent,
  },
  {
    slug: 'crypto',
    title: '冲刺卷RSA',
    description: '冲刺卷RSA 的迁移文章',
    date: '2021-05-15',
    category: 'Archive',
    tags: ['密码'],
    content: cryptoContent,
  },
  {
    slug: 'ios',
    title: 'ios俱乐部第一次培训',
    description: 'ios俱乐部第一次培训 的迁移文章',
    date: '',
    category: 'Archive',
    tags: ['ios'],
    content: iosContent,
  },
  {
    slug: 'room',
    title: 'Room--帮大佬代传',
    description: 'Room--帮大佬代传 的迁移文章',
    date: '2021-04-18',
    category: 'Archive',
    tags: ['android'],
    content: roomContent,
  },
].sort((left, right) => getPostTimestamp(right) - getPostTimestamp(left))

export const getPostBySlug = (slug) => posts.find((post) => post.slug === slug)
