// 通用接口
const pub = {};

// 登录
const login = {
  index: "/login"
};

// 文章
const article = {
  get: "/getArticle",
  operate: "/operateArticle",
  del: "/deleteArticle"
};

// 文章类型
const articleType = {
  get: "/getArticleType",
  operate: "/operateArticleType",
  del: "/deleteArticleType"
};

// 上传
const upload = {
  richImgSrc: "/upload/richtext_img_src",
  richImg: "/upload/richtext_img"
};

export default { pub, login, article, articleType, upload };
