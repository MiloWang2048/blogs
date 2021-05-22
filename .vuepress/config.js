module.exports = {
  title: "Blogs - Milo Wang",
  description: "Some nonsense notes.",
  dest: "public",
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
    sidebar: 'auto',
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
    startYear: "2021",
  },
  markdown: {
    lineNumbers: true,
  },
};
