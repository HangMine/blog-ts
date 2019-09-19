import React, { ReactNode, useState, useEffect, useRef } from 'react'
import './index.scss'

type prop = {
  children: ReactNode,
  maxHeight?: string | number
}

const getHeight = (height?: string | number) => {
  return (typeof height === 'string' ? height : `${height}px`) || 'auto'
}

const HideScroll = ({ children, maxHeight }: prop) => {
  // 显示高度
  const [height, setheight] = useState(0);
  // 滚动高度
  const [scrollHeight, setscrollHeight] = useState(0);
  // 滚动条高度
  const percent = +(height / scrollHeight).toFixed(2);
  const scrollBarHeight = Math.round(height * percent) || 0;

  const ref = useRef(null);

  useEffect(() => {
    let dom: any = ref.current;
    if (dom && dom.clientHeight !== dom.scrollHeight) {
      setheight(dom.clientHeight);
      setscrollHeight(dom.scrollHeight);
    }
  })

  // 当前滚动高度
  const [movePercent, setmovePercent] = useState(0)

  // 滚动事件
  const scrollHandle = (e: any) => {
    const currentScrollHeight = e.target.scrollTop;
    const movePercent = currentScrollHeight / (scrollHeight - height);
    setmovePercent(movePercent);
  }

  // 获取滚动条移动的距离
  const getScrollBarTransition = (movePercent: number) => {
    const distance = +((height - scrollBarHeight) * movePercent).toFixed(2);
    return distance;
  }


  return (
    <div className='hide-scroll'>
      <div className="scroll-main" onScroll={scrollHandle} style={{ maxHeight: getHeight(maxHeight) }} ref={ref}>
        {children}
      </div>
      <div className="scroll-mask" style={{ maxHeight: getHeight(maxHeight) }}>
        <div className="scroll-bar" style={{ height: scrollBarHeight, transform: `translateY(${getScrollBarTransition(movePercent)}px)` }}></div>
      </div>
    </div >

  )
}

export default HideScroll


