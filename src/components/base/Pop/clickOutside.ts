const clickOutside: clickOutside = (element, callback) => {
  // 修饰传进来的函数
  const currentCallback = (e: Event) => {
    const inSide = parent(e.target as HTMLElement, element);
    if (inSide) return;
    e.preventDefault();
    e.stopPropagation();
    callback(e);
    document.removeEventListener("click", currentCallback, true);
  };
  // 移除事件
  const off = () => {
    document.removeEventListener("click", currentCallback, true);
  };
  // 这里事件需要设置为捕获，阻止传播才有效果
  document.addEventListener("click", currentCallback, true);
  // 将移除事件元素暴露出去
  return off;
};

// 向上找到目标元素
const parent: parent = (startaDom, targetDom) => {
  if (startaDom === targetDom) {
    return true;
  } else if (startaDom.parentElement) {
    return parent(startaDom.parentElement, targetDom);
  } else {
    return false;
  }
};

export default clickOutside;
