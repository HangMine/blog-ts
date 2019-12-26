

const hoverOutside: hoverOutside = (elemens, callback) => {
  // 修饰传进来的函数
  const currentCallback = (e: Event) => {
    console.log(e.target)
    const inSide = parent(e.target as HTMLElement, elemens)
    if (inSide) return;
    e.preventDefault();
    e.stopPropagation();
    callback(e);
    document.removeEventListener('mousemove', currentCallback, true);
  }
  // 移除事件
  const off = () => {
    document.removeEventListener('mousemove', currentCallback, true);
  }
  // 这里事件需要设置为捕获，阻止传播才有效果
  document.addEventListener('mousemove', currentCallback, true);
  // 将移除事件元素暴露出去
  return off;
}



// 向上找到目标元素
const parent: hoverParent = (startaDom, targetDoms) => {
  if (targetDoms.includes(startaDom)) {
    return true
  } else if (startaDom.parentElement) {
    return parent(startaDom.parentElement, targetDoms);
  } else {
    return false;
  }
}

export default hoverOutside;