module.exports = {
  lang: 'zh-CN',
  title: 'Assassin',
  description: 'java开发,微服务,全栈,spring,vue,redis,mysql',
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  themeConfig: {
    locales: {
      '/': {
        // custom containers
        tip: '提示',
        warning: '注意',
        danger: '警告',
      },
    },
    logo: './logo.png',

    sidebar: 'auto',

    sidebarDepth: 3, // 侧边栏显示2级
    markdown: {
      extractHeaders: {
        level: [2],
      },
    },
    navbar: [
      { text: '首页', link: '/' },
      {
        text: 'Java',
        children: [
          {
            text: 'Java集合',
            children: [
              { text: 'HashMap', link: '/java/java集合/HashMap.md' },
              { text: 'ArrayList', link: '/java/java集合/ArrayList.md' },
            ],
          },
          //   {
          //     text: 'Java锁',
          //     children: [
          //       { text: 'CAS', link: '' },
          //       { text: 'synchronized', link: '' },
          //     ],
          //   },
          //   {
          //     text: 'Spring',
          //     children: [
          //       { text: 'Spring 之 Condition', link: '' },
          //       { text: 'spring', link: '' },
          //     ],
          //   },
        ],
      },
    ],
  },
}
