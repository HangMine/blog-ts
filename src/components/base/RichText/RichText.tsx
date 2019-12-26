import React, {
  FC,
  useState,
  useRef,
  useEffect,
  createElement,
  ReactNode
} from "react";
import { render } from "react-dom";
// 预防xss攻击
const xss = require("xss");
import $ from "./hQuery";
import "./RichText.scss";
import Model from "@/components/base/Model/Model";
import ImgUploadPanel from "./ImgUploadPanel";
import ColorPicker from "@/components/base/ColorPicker/ColorPicker";
import { Input, Button } from "antd";
import http from "@/assets/js/http";
const { TextArea } = Input;

type toolItemProp = {
  title: string;
  icon?: string;
  text?: string;
  fn?: any;
  tsx?: ReactNode;
  children?: toolItemProp[];
};

// document对象,需要支持iframe方式
let doc = document;

// content的DOM元素，需要支持iframe方式
let contentDom: any;
const setContentDom = (isIframe?: boolean) => {
  if (isIframe === undefined) {
    contentDom = null;
    return;
  }
  contentDom = isIframe ? $("body", doc) : $(".h-rich-text .content");
};

// 核心方法，执行命令
const exec = (
  command: string,
  showDefaultUI?: boolean,
  commandArg?: string
) => {
  doc.execCommand(command, showDefaultUI, commandArg);
};

// 核心方法，获取选中的对象
const getSelect = () => {
  const selection = doc.getSelection()!;
  return {
    selection
  };
};

// 选中
const select = (
  selectNode?: HTMLElement | false,
  collapsed?: "start" | "end"
) => {
  const { selection } = getSelect();
  let range = document.createRange();
  if (selectNode) {
    // 传入元素时选中元素
    range.selectNode(selectNode);
  } else {
    // 恢复原本选中
    range.setStart(selection.anchorNode!, selection.anchorOffset);
    range.setEnd(selection.focusNode!, selection.focusOffset);
  }
  selection.removeAllRanges();
  selection.addRange(range);
  switch (collapsed) {
    case "start":
      selection.collapseToStart();
      break;

    case "end":
      selection.collapseToEnd();
      break;

    default:
      break;
  }
};

// 监听粘贴(为了在addEventListenter中传参，使用闭包）
const getOnPasete = (e: any, props: obj) => {
  const onPaste = () => {
    e.preventDefault();
    handlePaste(e, props);
  };
  return onPaste;
};

// 处理粘贴
const handlePaste = (e: any, props: obj) => {
  const clipboardData = e.clipboardData || (window as any).clipboardData;
  // 复制的内容都在clipboardData.items里，分为stirng(又分为text/plain和html/plain两种类型)和file两种类型
  let html = "";
  for (const item of clipboardData.items) {
    if (item.kind === "string") {
      // 如果有html,会放在后面，所以只取最后一个的值
      item.getAsString((str: string) => {
        html = str;
      });
    } else if (item.kind === "file") {
      const pasteFile = item.getAsFile();
    }
  }
  // 需要用setTimeout，因为html是在getAsString的回调里面拿到的，是异步的
  setTimeout(() => {
    // 输出格式化化后的html
    format.init(html, props);
  }, 0);
};

// 格式化
const format = {
  // 正则:获取标签
  TAG_REG: /<(?!\/)(.+?)>/g,
  // 正则:获取标签名和属性
  TAG_NAME_ATTR_REG: /(?<=<(.+)) (.+)(?=>)/,
  // 正则:获取属性
  ATTR_REG: /\b(.+?)="(.*?)"/g,
  // 正则:获取style
  STYLE_REG: /\b(.+?):(.+?);/g,
  // 初始化
  init: (html: string, props: obj) => {
    let handleAttr = [];
    let handleStyle = [];
    if (props.clearStyle) {
      handleAttr.push(format.clearAttr.handleAttr);
      handleStyle.push(format.clearAttr.handleStyle);
    }
    if (props.imgUploadUrl) {
      handleAttr.push(format.addUploadImgFlag.handleAttr);
    }
    exec(
      "insertHTML",
      false,
      format.handleHtml({
        html,
        handleAttr,
        handleStyle
      })
    );
    props.imgUploadUrl &&
      format.imgReplace(props.imgUploadUrl, props.imgBaseUrl);
  },
  // 获取标签
  getTags: (html: string) => {
    return html.match(format.TAG_REG) || [];
  },
  // 获取标签名和属性
  getTagKeyAttr: (tag: string) => {
    const matchs = tag.match(format.TAG_NAME_ATTR_REG);
    const tagKey = (matchs && matchs[1]) || "";
    const attrStr = (matchs && matchs[2]) || "";
    return [tagKey, attrStr];
  },
  // 获取属性
  getAttrs: (attrStr: string) => {
    return attrStr.match(format.ATTR_REG) || [];
  },
  // 获取style里面的值
  getStyles: (styleValue: string) => {
    return styleValue.match(format.STYLE_REG) || [];
  },

  // 清除属性
  clearAttr: {
    handleAttr: (
      attr: string,
      attrKey: string,
      attrValue: string,
      tagKey: string
    ) => {
      // 照片增加需要上传的标记
      if (tagKey === "img" && attrKey === "src") {
        attr = attr.replace(
          attrValue,
          `${attrValue}" data-img-upload="${attrValue}`
        );
      }
      // 不作处理的属性
      const KEEP_ATTRS = ["href", "src", "width", "height", "type"];
      return KEEP_ATTRS.includes(attrKey) ? attr : "";
    },
    handleStyle: (
      style: string,
      styleKey: string,
      styleValue: string,
      attrKey: string,
      attrValue: string
    ) => {
      // 不作处理的样式
      const KEEP_WIDTH_HEIGHT_ATTRKEY = ["img", "iframe"];
      const KEEP_STYLE_KEY = ["width", "height"];
      return KEEP_WIDTH_HEIGHT_ATTRKEY.includes(attrKey) &&
        KEEP_STYLE_KEY.includes(styleKey)
        ? style
        : "";
    }
  },
  // 获取base64
  getBase64(url: string, onload: (base64: string) => void, ext = "png") {
    let canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0, img.width, img.height);
      const base64 = canvas.toDataURL("image/" + ext);
      onload(base64);
    };
    img.src = `${url}?v=${new Date().valueOf()}`;
    document.body.appendChild(img);
  },
  // 图片转base64(涉及跨域问题，需要服务端进行转发，参考：https://segmentfault.com/a/1190000016423028)
  // 并且还涉及到异步的设置属性，很难搞，后续再看能否解决
  img2base64: {
    handleAttr: (attr: string, attrKey: string, attrValue: string) => {
      if (attrKey === "src") {
        attr = attr.replace(attrValue, `${attrValue}" crossOrigin="anonymous`);
        const onload = (base64: string) => {
          attr = attr.replace(attrValue, `${base64}`);
        };
        format.getBase64(attrValue, onload);
      }
      return attr;
    }
  },
  // 必须处理
  addUploadImgFlag: {
    handleAttr: (
      attr: string,
      attrKey: string,
      attrValue: string,
      tagKey: string
    ) => {
      // 照片增加需要上传的标记
      if (tagKey === "img" && attrKey === "src") {
        attr = attr.replace(
          attrValue,
          `${attrValue}" data-img-upload="${attrValue}`
        );
      }
      return attr;
    }
  },
  // 把图片标签替换成上传图片模块
  imgReplace: (uploadUrl: string, baseUrl: string) => {
    const initImgs = $("[data-img-upload]", doc);
    initImgs.forEach((img: any) => {
      const imgWrap = document.createElement("div");
      imgWrap.classList.add("uploaded-img-wrap");

      const uploadSuccess = (res: obj) => {
        // 成功后绑定点击事件:点击选中自身（后续检查是否需要移除事件绑定）
        imgWrap.onclick = (e: any) => {
          select(e.target);
        };
        render(
          <ImgUploadPanel
            src={`${baseUrl}/${res.src}`}
            isSuccess
          ></ImgUploadPanel>,
          imgWrap
        );
      };
      const uploadError = (err: obj) => {
        render(<ImgUploadPanel isError></ImgUploadPanel>, imgWrap);
      };
      render(
        <ImgUploadPanel
          src={img.src}
          uploadUrl={uploadUrl}
          onOk={uploadSuccess}
          onError={uploadError}
        ></ImgUploadPanel>,
        imgWrap
      );
      $(img)
        .after(imgWrap)
        .remove();
    });
  },
  // 三层循环
  handleHtml: ({
    html,
    handleTag,
    handleAttr,
    handleStyle,
    handleHtml
  }: {
    html: string;
    handleTag?: ((tag: string, tagKey: string, attrStr: string) => string)[];
    handleAttr?: ((
      attr: string,
      attrKey: string,
      attrValue: string,
      tagKey: string
    ) => string)[];
    handleStyle?: ((
      style: string,
      styleKey: string,
      styleValue: string,
      attrKey: string,
      attrValue: string
    ) => string)[];
    handleHtml?: ((html: string) => string)[];
  }) => {
    const tags = format.getTags(html);
    // 处理标签
    for (let tag of tags) {
      const [tagKey, attrStr] = format.getTagKeyAttr(tag);
      if (handleTag) {
        handleTag.forEach(fn => (tag = fn(tag, tagKey, attrStr)));
      }
      const attrs = format.getAttrs(attrStr);
      let resAttrStr = attrStr;
      // 处理属性
      for (let attr of attrs) {
        let [attrKey, attrValue] = attr.split("=");
        attrValue = attrValue.replace(/"/g, "");
        // 保存原本属性数据，以便replace掉（感觉可以后续优化）
        const initAttr = attr;

        if (handleAttr) {
          handleAttr.forEach(fn => {
            const handledAttr = fn(attr, attrKey, attrValue, tagKey);
            // 如果返回的是普通的字符串
            attr = handledAttr;
          });
        }

        // 处理样式
        if (attrKey === "style") {
          let styles = format.getStyles(attrValue);
          // 保存原本样式数据，以便replace掉（感觉可以后续优化）
          let initStyleValue = attrValue;
          styles = styles.map(style => {
            const [styleKey, styleValue] = style.replace(/"| /g, "").split(":");
            if (handleStyle) {
              handleStyle.forEach(
                fn =>
                  (style = fn(style, styleKey, styleValue, attrKey, attrValue))
              );
            }
            return style;
          });
          const resStyleValue = styles.join("");
          resAttrStr = resAttrStr.replace(initStyleValue, resStyleValue);
        } else {
          resAttrStr = resAttrStr.replace(initAttr, attr);
        }
      }
      const emptyTag = tag.replace(attrStr, resAttrStr);
      html = html.replace(tag, emptyTag);
      if (handleHtml) {
        handleHtml.forEach(fn => (html = fn(html)));
      }
    }
    return html;
  }
};

// 新开一行并选中
const createP = () => {
  const p = $().create("<p><br></p>");
  contentDom.append(p);
  select(p);
};

// 获取引用块和当前选中元素，用于检测是否是引用块
const getBlockquote = () => {
  const selection = getSelect().selection;
  const currentNode = selection.anchorNode;
  const currentDom =
    currentNode!.nodeType === 3 ? currentNode!.parentElement : currentNode;
  const blockquote = $(currentDom, doc).parent("blockquote");
  return { blockquote, currentNode };
};

// 保持光标在可编辑窗口的最下面
const keepCursorBottom = () => {
  const { selection } = getSelect();
  const cursorNode = selection.anchorNode as HTMLElement;
  const cursorHeight =
    cursorNode.getBoundingClientRect().top -
    contentDom[0].getBoundingClientRect().top;
  const contentHeight = contentDom[0].clientHeight;
  if (cursorHeight - contentHeight > 20) {
    contentDom[0].scrollTop = contentDom[0].scrollHeight;
  }
};

// 监听键盘
const onKeydown = (e: any) => {
  const key = e.keyCode;
  let blockquote, currentNode: any;
  switch (key) {
    // 回车
    case 13:
      // 引用需要特殊处理
      const enterQuote = getBlockquote();
      blockquote = enterQuote.blockquote;
      if (blockquote) {
        // 引用
        currentNode = enterQuote.currentNode;
        const html = currentNode.innerHTML || currentNode;
        const isEmpty = html === "<br>" || !html;
        if (isEmpty) {
          const afterDom = $(blockquote).next()[0];

          if (!afterDom) {
            const p = $().create("<p><br></p>");
            $(blockquote).after(p);
            select(p);
          } else {
            select(afterDom, "end");
          }
        }
      } else {
        // 正常
        e.preventDefault();
        exec("insertParagraph");
      }

      keepCursorBottom();

      break;
    // 删除
    case 8:
      const emptyFlags = ["<p><br></p>", "<br>", "", undefined];
      const isEmpty = emptyFlags.includes(contentDom[0].innerHTML);
      if (isEmpty) {
        createP();
      } else {
        // 当是引用时
        const delQuote = getBlockquote();
        blockquote = delQuote.blockquote;
        if (blockquote) {
          const blockquoteHtml = (blockquote as any).innerHTML;
          // 当删除图片时，此处有BUG，后续需要再解决
          if (blockquoteHtml === "<p><br></p>") {
            $(blockquote).remove();
            if (!contentDom[0].innerHTML) {
              // 必须使用setTimeout，否则不出现，后续需检查
              setTimeout(() => {
                createP();
              }, 0);
            }
          }
        }
      }
    default:
      break;
  }
};

type richText = {
  isIframe?: boolean;
  height?: number | string;
  clearStyle?: boolean;
  imgUploadUrl?: string;
  imgBaseUrl?: string;
  preColors?: string[];
  value?: string;
  save?: {
    url: string;
    key: string;
    params: obj;
    done?: () => void;
  };
};

const RichText: FC<richText> = props => {
  const defaultProps = {
    isIframe: true,
    height: "100vh",
    clearStyle: false,
    imgUploadUrl: "",
    imgBaseUrl: "",
    preColors: [
      "#ff4500",
      "#ff8c00",
      "#ffd700",
      "#90ee90",
      "#00ced1",
      "#1e90ff",
      "#c71585",
      "rgba(255, 69, 0, 0.68)",
      "rgb(255, 120, 0)",
      "hsv(51, 100, 98)",
      "hsva(120, 40, 94, 0.5)",
      "hsl(181, 100%, 37%)",
      "hsla(209, 100%, 56%, 0.73)",
      "#c7158577"
    ]
  };

  const _props = {
    ...defaultProps,
    ...props
  };

  const command = {
    // 加粗
    bold: (e: Event) => {
      e.preventDefault();
      exec("bold");
    },
    // 斜体
    italic: (e: Event) => {
      e.preventDefault();
      exec("italic");
    },
    // 标题
    title: (e: Event, type: string) => {
      e.preventDefault();
      exec("formatBlock", false, type);
    },
    // 颜色
    color: (e: Event, color: string) => {
      // 通过回调设置
    },
    // 删除线
    strikeThrough: (e: Event) => {
      e.preventDefault();
      exec("strikeThrough");
    },
    // 下划线
    underline: (e: Event) => {
      e.preventDefault();
      exec("underline");
    },
    // 引用
    quote: (e: Event) => {
      e.preventDefault();
      const { selection } = getSelect();
      const content: any = selection.anchorNode;
      if (!content) return;

      if (selection.anchorNode === selection.focusNode) {
        // 只选择了一个元素
        if (content.nodeType === 3) {
          // 如果是文本
          const text = selection.anchorNode!.parentElement!.outerHTML;
          exec("formatBlock", false, "BLOCKQUOTE");
          const p = selection.anchorNode!.parentElement!;
          p.innerHTML = text;
          select(p, "end");
        } else {
          // 如果是元素
          const text = content.outerHTML;
          exec("formatBlock", false, "BLOCKQUOTE");
          const dom: any = selection.anchorNode;
          dom.innerHTML = text;
          select(dom, "end");
        }
      } else {
        // 选择了多个元素
        const fragment = selection.getRangeAt(0).cloneContents();
        const wrap = document.createElement("div");
        wrap.appendChild(fragment);
        const text = wrap.innerHTML;
        exec("formatBlock", false, "BLOCKQUOTE");
        const { blockquote } = getBlockquote();
        blockquote.innerHTML = text;
        select(blockquote, "end");
      }
    },
    // 插入链接
    createLink: (e: Event) => {
      e.preventDefault();
      const { selection } = getSelect();
      if (
        selection.type === "Range" &&
        selection.anchorNode &&
        selection.anchorNode.nodeName === "#text"
      ) {
        // 如果有选中文字
        setlink(selection.anchorNode.nodeValue || "");
      }
      setlinkShow(true);
    },
    // 取消链接
    unlink: (e: Event) => {
      e.preventDefault();
      exec("unlink");
    },
    // 插入图片
    insertImgs: (e: Event) => {
      e.preventDefault();
      setimgShow(true);
    },
    // 左对齐
    justifyLeft: (e: Event) => {
      e.preventDefault();
      exec("justifyLeft");
    },
    // 居中
    justifyCenter: (e: Event) => {
      e.preventDefault();
      exec("justifyCenter");
    },
    // 右对齐
    justifyRight: (e: Event) => {
      e.preventDefault();
      exec("justifyRight");
    },
    // 左右对齐
    justifyFull: (e: Event) => {
      e.preventDefault();
      exec("justifyFull");
    },
    // 源代码
    code: (e: Event) => {
      e.preventDefault();
      setcodeShow(true);
      setcode(contentDom[0].innerHTML);
    },
    // 撤销
    undo: (e: Event) => {
      e.preventDefault();
      exec("undo");
    },
    // 重做
    redo: (e: Event) => {
      e.preventDefault();
      exec("redo");
    },
    // 保存
    save: (e: Event) => {
      if (!props.save) return;
      e.preventDefault();
      const _save = props.save || {};
      http
        .post(_save.url, {
          ..._save.params,
          [_save.key]: contentDom[0].innerHTML
        })
        .then(res => {
          // 抛出save事件
          _save.done && _save.done();
        });
    }
  };

  const toolData: toolItemProp[] = [
    {
      title: "粗体",
      icon: "icon-zitijiacu",
      fn: command.bold
    },
    {
      title: "斜体",
      icon: "icon-zitixieti",
      fn: command.italic
    },
    {
      title: "标题1",
      text: "H1",
      children: [
        {
          title: "标题1",
          text: "H1",
          fn: (e: Event) => command.title(e, "H1")
        },
        {
          title: "标题2",
          text: "H2",
          fn: (e: Event) => command.title(e, "H2")
        },
        {
          title: "标题3",
          text: "H3",
          fn: (e: Event) => command.title(e, "H3")
        },
        {
          title: "标题2",
          text: "H4",
          fn: (e: Event) => command.title(e, "H4")
        }
      ]
    },
    {
      title: "颜色",
      tsx: (
        <ColorPicker
          mask={true}
          showAlpha
          preColors={_props.preColors}
          onOk={color => exec("foreColor", false, color)}
        >
          <i className="iconfont icon-zitiyanse"></i>
        </ColorPicker>
      ),
      fn: command.color
    },
    {
      title: "下划线",
      icon: "icon-zitixiahuaxian",
      fn: command.underline
    },
    {
      title: "引用",
      icon: "icon-yinyong",
      fn: command.quote
    },
    {
      title: "插入链接",
      icon: "icon-charulianjie",
      fn: command.createLink
    },
    {
      title: "取消链接",
      icon: "icon-quxiaolianjie",
      fn: command.unlink
    },
    {
      title: "插入图片",
      icon: "icon-charutupian",
      fn: command.insertImgs
    },
    {
      title: "删除线",
      icon: "icon-zitishanchuxian",
      fn: command.strikeThrough
    },
    {
      title: "左对齐",
      icon: "icon-zuoduiqi",
      fn: command.justifyLeft
    },
    {
      title: "居中",
      icon: "icon-juzhongduiqi",
      fn: command.justifyCenter
    },
    {
      title: "右对齐",
      icon: "icon-youduiqi",
      fn: command.justifyRight
    },
    {
      title: "左右对齐",
      icon: "icon-zuoyouduiqi",
      fn: command.justifyFull
    },
    {
      title: "源代码",
      icon: "icon-zitidaima",
      fn: command.code
    },
    {
      title: "撤销",
      icon: "icon-shangyibu",
      children: [
        {
          title: "撤销",
          icon: "icon-shangyibu",
          fn: command.undo
        },
        {
          title: "重做",
          icon: "icon-xiayibu",
          fn: command.redo
        }
      ]
    },
    {
      title: "保存",
      icon: "icon-baocun",
      fn: command.save
    }
  ];

  // 初始加载
  const iframe = useRef(null);
  useEffect(() => {
    if (_props.isIframe) {
      const ifr = iframe.current as any;
      doc = ifr.contentDocument || ifr.contentWindow.document;
      const link = doc.createElement("link");
      link.href = "/richtext_iframe.css";
      link.rel = "stylesheet";
      doc.head.appendChild(link);
    }
    docInit(_props);
    return () => {
      setContentDom();
      doc.removeEventListener("paste", e => getOnPasete(e, _props)());
      doc.removeEventListener("keydown", onKeydown);
    };
  }, []);

  useEffect(() => {
    // 设置初始值
    docInit(_props);
    if (props.value !== undefined) contentDom[0].innerHTML = props.value;
  }, [props.value]);

  // doc对象初始化
  const docInit = (props: obj) => {
    if (contentDom) return;
    setContentDom(props.isIframe);
    contentDom.append("<p><br></p>");
    if (props.isIframe) {
      doc.designMode = "on";
      doc.addEventListener("paste", e => getOnPasete(e, props)());
      doc.addEventListener("keydown", onKeydown);
      doc.body.style.margin = "0";
    }
  };

  // 源代码模态框
  const [codeShow, setcodeShow] = useState(false);
  const [code, setcode] = useState("");
  const saveEditCode = () => {
    contentDom[0].innerHTML = xss(code);
    setcodeShow(false);
  };

  // 插入图片模态框
  const [imgShow, setimgShow] = useState(false);
  const uploadImgInput: any = useRef(null);
  const clickInput = () => {
    uploadImgInput.current.click();
  };
  // 上传图片
  const uploadImgs = (e: any) => {
    // 在没有选中目标的时候，默认在最后面创建P标签并选中
    if (!doc.getSelection()!.rangeCount) createP();

    setimgShow(false);

    const files = e.target.files;

    for (const [i, file] of Object.entries(files)) {
      const formData: any = new FormData();
      formData.append("file", file);
      const src = URL.createObjectURL(file);
      const uploadUrl = "upload.richImg";
      const imgWrap = document.createElement("div");
      imgWrap.classList.add("uploaded-img-wrap");
      const id = Math.random()
        .toString(36)
        .slice(3, 9);
      imgWrap.setAttribute("data-id", id);

      const uploadSuccess = (res: any) => {
        const wrap = ($(`[data-id=${id}]`, doc) as any)[0];
        // 成功后绑定点击事件:点击选中自身
        wrap.onclick = (e: any) => {
          select(e.target);
        };
        render(
          <ImgUploadPanel
            src={`${_props.imgBaseUrl}/${res.src}`}
            isSuccess
          ></ImgUploadPanel>,
          wrap
        );
      };

      const uploadError = (err: obj) => {
        render(<ImgUploadPanel isError></ImgUploadPanel>, imgWrap);
      };
      render(
        <ImgUploadPanel
          type="file"
          src={src}
          uploadUrl={uploadUrl}
          formData={formData}
          onOk={uploadSuccess}
          onError={uploadError}
        ></ImgUploadPanel>,
        imgWrap
      );
      exec("insertHTML", false, imgWrap.outerHTML);
      createP();
    }
  };

  // 插入链接模态框
  const [linkShow, setlinkShow] = useState(false);
  const [link, setlink] = useState("");
  useEffect(() => {
    if (!linkShow) setlink("");
  }, [linkShow]);
  // 插入链接
  const createLink = (link: string) => {
    exec("createLink", false, link);
    setlinkShow(false);
  };

  return (
    <div className="h-rich-text" style={{ height: _props.height }}>
      {/* 工具栏 */}
      <ul className="tool-bar">
        {toolData.map((item, i) => (
          <li key={i} className="tool-bar-item" onMouseDown={item.fn}>
            {item.text ? (
              <span className="tool-bar-text">{item.text}</span>
            ) : (
              item.tsx || <i className={`iconfont ${item.icon}`}></i>
            )}
            {item.children && (
              <>
                <i className="triangle"></i>
                <ul className="tool-bar-child">
                  {item.children.map((child, i) => (
                    <li
                      key={i}
                      className="tool-bar-child-item"
                      onMouseDown={child.fn}
                    >
                      {child.text ? (
                        <span className="tool-bar-text">{child.text}</span>
                      ) : (
                        child.tsx || (
                          <i className={`iconfont ${child.icon}`}></i>
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* 编辑区 */}
      {_props.isIframe ? (
        <iframe
          className="content"
          ref={iframe}
          src=""
          frameBorder="0"
        ></iframe>
      ) : (
        <div
          className="content"
          contentEditable
          onPaste={e => getOnPasete(e, _props)()}
          onKeyDown={onKeydown}
        ></div>
      )}

      {/* 源代码弹窗 */}
      <Model
        title="源代码"
        visable={codeShow}
        onOK={saveEditCode}
        onCancel={() => {
          setcodeShow(false);
        }}
      >
        <TextArea
          rows={16}
          value={code}
          onChange={e => {
            setcode(e.target.value);
          }}
        ></TextArea>
      </Model>
      {/* 插入图片弹窗 */}
      <Model
        title="插入图片"
        visable={imgShow}
        onCancel={() => {
          setimgShow(false);
        }}
      >
        <Button type="primary" onClick={clickInput}>
          点击上传（可多张）
        </Button>
        <input
          type="file"
          hidden
          multiple
          ref={uploadImgInput}
          onChange={uploadImgs}
        ></input>
      </Model>
      {/* 插入链接弹窗 */}
      <Model
        title="插入链接"
        visable={linkShow}
        onOK={() => createLink(link)}
        onCancel={() => {
          setlinkShow(false);
        }}
      >
        <Input value={link} onChange={e => setlink(e.target.value)}></Input>
      </Model>
    </div>
  );
};

export default RichText;
