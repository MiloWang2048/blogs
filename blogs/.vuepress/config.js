module.exports = {
  title: "Blogs - Milo Wang",
  description: "Some nonsense notes.",
  dest: "dist",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
    [
      "script",
      {}, // baidu stats
      'var _hmt = _hmt || [];(function() { var hm = document.createElement("script"); hm.src = "https://hm.baidu.com/hm.js?d56e9708c60d5a14ed1a824ef152b315"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s);})();',
    ],
  ],
  theme: "reco",
  themeConfig: {
    nav: [
      {
        text: "Home",
        link: "/",
        icon: "reco-home",
      },
      {
        text: "TimeLine",
        link: "/timeline/",
        icon: "reco-date",
      },
      {
        text: "Contact",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/MiloWang2048",
            icon: "reco-github",
          },
        ],
      },
    ],
    sidebar: "auto",
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "Category",
      },
      tag: {
        location: 3,
        text: "Tags",
      },
    },
    logo: "/milo.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "milowang",
    authorAvatar: "/milo.png",
    record: "陕ICP备19001517号-2",
    recordLink: "https://beian.miit.gov.cn/",
    startYear: "2021",
  },
  markdown: {
    lineNumbers: true,
  },
};
