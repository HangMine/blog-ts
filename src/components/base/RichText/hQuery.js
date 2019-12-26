// V1.4

class HQuery {
  constructor(selector, doc = document) {
    this.doc = doc;
    if (selector) {
      // 如果有传入值
      var doms = this.isDOM(selector) ? [selector] : doc.querySelectorAll(selector);
      for (var i = 0; i < doms.length; i++) {
        this[i] = doms[i];
      }
      this.length = doms.length;
    } else {
      // 如果没传入值
      this.length = 0;
    }
    // 提供数组的方法，后续看怎么继承
    this.map = [].map;
    this.forEach = [].forEach;
  }

  // 获取doms的数组
  toArray() {
    return [].slice.call(this);
  }

  //是否是dom元素
  isDOM(obj) {
    return typeof HTMLElement === "object"
      ? obj instanceof HTMLElement
      : obj &&
      typeof obj === "object" &&
      (obj.nodeType === 1 || obj.nodeType === 9) &&
      typeof obj.nodeName === "string";
  }

  // 字符串转为dom元素
  str2dom(html) {
    var el = this.doc.createElement('div');
    el.innerHTML = html;
    return Array.from(el.childNodes);
  }

  // 兼容el类型获取dom元素
  getDom(el) {
    try {
      const doms = this.doc.querySelectorAll(el);
      return doms.length ? this.doc.querySelectorAll(el) : this.str2dom(el)

    } catch (error) {
      return this.isDOM(el) ? [el] : this.str2dom(el)
    }

  }


  // 创建一个元素，直接返回创建的元素，跟其它方法不同
  create(el) {
    return this.getDom(el)[0]
  }

  // 删除一个或全部子元素
  empty(el) {

    const _empty = (dom) => {
      el ? dom.parentElement.removeChild(el) : dom.innerHTML = '';
    }

    this.map(_empty);

    return this;
  }

  // 设置HTML
  html(html) {


    const _html = (dom) => {
      dom.innerHTML = html;
    }

    this.map(_html);

    return this;
  }

  // 设置text
  text(text) {

    const _text = (dom) => {
      dom.textContent = text;
    }

    this.map(_text);

    return this;
  }

  // 在子元素的最后插入元素
  append(el) {

    const _append = (dom) => {
      this.getDom(el).map(el => dom.appendChild(el))
    }

    this.map(_append);

    return this;
  }

  // 在元素后面插入元素
  after(el) {

    const _after = (dom) => {
      const parent = dom.parentElement;
      if (parent.lastChild === dom) {
        this.getDom(el).map(el => parent.appendChild(el))
      } else {
        this.getDom(el).map(el => parent.insertBefore(el, dom.nextSibling))
      }
    }

    this.map(_after);

    return this;
  }
  // 上一元素
  prev() {

    const _prev = (dom) => {
      return dom.previousElementSibling
    }

    return this.map(_prev);

  }
  // 下一元素
  next() {

    const _next = (dom) => {
      return dom.nextElementSibling
    }

    return this.map(_next);

  }
  // 最后一个元素
  last() {
    const _last = (dom) => {
      return dom.lastChild
    }

    return this.map(_last);

  }

  // 绑定事件
  on(name, fn, isCatch) {

    const _on = (dom) => {
      isCatch = isCatch || false;
      dom.addEventListener(name, fn, isCatch);
    }

    this.map(_on);

    return this;

  }

  // 解绑事件
  unbind(name, fn, isCatch) {

    const _unbind = (dom) => {
      isCatch = isCatch || false;
      dom.removeEventListener(name, fn, isCatch);
    }

    this.map(_unbind);

    return this;
  }

  // 设置样式
  setStyle(styleObj) {

    // 设置单个样式
    const _setStyle = (dom) => {
      for (var key in styleObj) {
        dom.style[key] = styleObj[key];
      }
    }

    this.map(_setStyle);

    return this;
  }

  // 增加class
  addClass(_class) {

    // 设置单个class
    const _setClass = (dom) => {
      dom.classList.add(_class);
    }

    this.map(_setClass);

    return this;
  }

  // 切换class
  toogleClass(_class, toogleClass) {

    // 设置单个class
    const _toggleClass = (dom) => {
      dom.classList.remove(_class);
      dom.classList.add(toogleClass);
    }

    this.map(_toggleClass);

    return this;
  }

  // 移除class
  removeClass(_class) {

    // 移除单个class
    const _removeClass = (dom) => {
      dom.classList.remove(_class);
    }

    this.map(_removeClass);

    return this;
  }

  // 删除元素
  remove() {

    // 删除单个元素
    const _remove = (dom) => {
      dom.parentElement.removeChild(dom);
    }

    this.map(_remove);

    return this;
  }

  // 向上遍历，看是否存在元素
  parent(el) {
    const dom = this[0] || this;
    const targetDom = this.getDom(el)[0];
    const _parent = (dom, targetDom) => {
      if (dom.isEqualNode(targetDom)) {
        return dom
      } else if (dom.parentElement) {
        return _parent(dom.parentElement, targetDom);
      } else {
        return undefined;
      }
    }

    return _parent(dom, targetDom)

  }


}

const _ = (selector, doc) => new HQuery(selector, doc)

export default _;