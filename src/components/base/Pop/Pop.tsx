import React, { FC, ReactElement, useState, useEffect, useRef } from 'react'
import { createPortal, render } from 'react-dom';
import { on, off } from './event';
import clickOutside from "./clickOutside";
import hoverOutside from './hoverOutside';
import { CSSTransition } from 'react-transition-group'
import './Pop.scss';


type PopProps = {
  visible?: boolean,
  onVisibleChange?: (visable: boolean) => void,
  content: ReactElement,
  trigger?: 'hover' | 'click',
  position?: 'bottom' | 'top' | 'left' | 'right',
  adjustOver?: boolean,
  mask?: boolean | 'opacity',
  trend?: boolean,
  offset?: {
    left?: number,
    top?: number,
    right?: number,
    bottom?: number
  }
}

const Pop: FC<PopProps> = ({ children, visible, onVisibleChange, content, trigger = "click", position = 'top', adjustOver = true, offset, mask, trend = true }) => {

  const [el, setel] = useState(cretaeEl());
  const [show, setshow] = useState(false);
  const containerRef = useRef(null);

  // 如果智能调整位置，需要修改当前Position
  const [currentPosition, setcurrentPosition] = useState(position);

  // 弹出层和箭头位置
  const [popPos, setpopPos] = useState({ left: 0, top: 0, trendLeft: 0, trendTop: 0 })


  // 保存clickOutside的清除函数，需要用cuurent，因为在回调中用到
  const clickOutsideOff: any = useRef(null);

  // 是否显示遮罩层
  const showMask = trigger === 'click' && mask;

  // 首次加载时，绑定容器点击事件
  useEffect(() => {
    // 暂时在这里添加到Body，否则content里面的ref.current获取不到！！！！后续需修改！！！！
    document.body.appendChild(el);
    on(containerRef.current!, trigger, pop, unpop);
    return (() => {
      off(containerRef.current!, trigger, pop, unpop);
      document.body.removeChild(el);
    })
  }, [])

  // 外部控制显隐
  useEffect(() => {
    visible !== undefined && visible ? pop() : unpop();
  }, [visible])

  // 弹出
  const pop = () => {
    setshow(true);
  }
  // 关闭
  const unpop = () => {
    setshow(false);
  }

  // 当前组件控制显隐
  useEffect(() => {
    onVisibleChange && onVisibleChange(show);
    const content = document.querySelector('.h-pop-content-wrap') as HTMLElement
    if (show) {
      // document.body.appendChild(el);
      if (trigger === 'hover') on(content, 'mouseleave', unpop);
      // 弹出处理函数
      const popPos = getPosition(containerRef.current!, content, currentPosition);
      setpopPos(popPos);
      content.style.left = popPos.left + 'px';
      content.style.top = popPos.top + 'px';

      if (!showMask) {
        // 不显示遮罩层，绑定document函数来关闭
        clickOutsideOff.current = trigger === 'click' ? clickOutside(content, unpop) : hoverOutside([content, containerRef.current!], unpop);
      }

    } else {
      // 关闭处理函数
      if (clickOutsideOff.current) {
        clickOutsideOff.current();
        clickOutsideOff.current = null;
      }
    }
  }, [show])



  // 获取弹出元素位置
  const getPosition = (container: HTMLElement, content: HTMLElement, position: 'bottom' | 'top' | 'left' | 'right'): any => {
    const { left: containerLeft, right: containerRight, bottom: containerBottom, top: containerTop, width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
    const contentWidth = content.clientWidth;
    const contentHeight = content.clientHeight;
    const winWidth = document.documentElement.clientWidth;
    const winHeight = document.documentElement.clientHeight;
    let top = 0, left = 0, trendTop = 0, trendLeft = 0, outHeight, outRightWidth, TREND_SIZE = 12, TREND_OFFSET_BORDER = 5;//TREND_OFFSET_BORDER是距离边框的距离
    switch (position) {
      case 'bottom':

        top = containerBottom;
        left = containerLeft + (containerWidth / 2) - (contentWidth / 2);
        trendTop = 0 + 1;//+1是为了挡住content的border
        trendLeft = contentWidth / 2 - TREND_SIZE / 2;
        break;
      case 'top':
        top = containerTop - contentHeight;
        left = containerLeft + (containerWidth / 2) - (contentWidth / 2);
        trendTop = 0 + contentHeight - TREND_SIZE - 1;//-1是为了挡住content的border
        trendLeft = contentWidth / 2 - TREND_SIZE / 2;
        break;
      case 'left':
        top = containerTop - containerHeight / 2;
        left = containerLeft - contentWidth;
        trendTop = contentHeight / 2 - TREND_SIZE / 2;
        trendLeft = 0 + contentWidth - TREND_SIZE - 1;//-1是为了挡住content的border
        break;
      case 'right':
        top = containerTop - containerHeight / 2;
        left = containerRight;
        trendTop = contentHeight / 2 - TREND_SIZE / 2;
        trendLeft = 0 + 1;//+1是为了挡住content的border
        break;
      default:
        break;
    }
    // 兼容超出屏幕
    if (adjustOver) {
      // 超出屏幕兼容
      if (top < 0) {
        // 超出上边
        // 更换方向
        setcurrentPosition('bottom');
        return getPosition(container, content, 'bottom');
        // 调整距离
        top = 0;

      } else if (top + contentHeight - winHeight > 0) {
        // 超出下边
        // 更换方向
        setcurrentPosition('top');
        return getPosition(container, content, 'top');
        // 调整距离
        outHeight = top + contentHeight - winHeight;
        top = top - outHeight;
      }
      if (left < 0) {
        // 超出左边

        // 更换方向(暂时不更换，否则出现top和left同时需要兼容的场景会死循环)
        // setcurrentPosition('right');
        // return getPosition(container, content, 'right');
        // 调整距离
        trendLeft += left + TREND_OFFSET_BORDER
        left = 0

      } else if (outRightWidth = left + contentWidth - winWidth > 0) {
        // 超出右边
        outRightWidth = left + contentWidth - winWidth;
        if (outRightWidth > 0) {
          // 更换方向(暂时不更换，否则出现top和left同时需要兼容的场景会死循环)
          // setcurrentPosition('left');
          // return getPosition(container, content, 'left');
          // 调整距离
          trendLeft += Math.max(0, outRightWidth - TREND_OFFSET_BORDER)
          left = left - outRightWidth;
        }
      }
    }

    // 如果有传入自定义调整距离
    if (offset) {
      const getOffset = (value: number) => value || 0
      left = left + getOffset(offset.left!) - getOffset(offset.right!)
      top = top + getOffset(offset.top!) - getOffset(offset.bottom!)
    }

    return {
      left,
      top,
      trendLeft,
      trendTop
    }
  }


  return (
    <div className="h-pop">
      <div ref={containerRef} className="h-pop-container" >
        {children}
      </div>

      {createPortal(
        <>
          <CSSTransition
            mountOnEnter
            in={show}
            timeout={300}
            classNames='default'
            onEnter={() => { el.style.display = 'inline-block' }}
            onExited={() => { el.style.display = 'none' }}
          >
            <div className="h-pop-transition">
              <div className="h-pop-content">
                {content}
              </div>
              {trend && <div className={`h-pop-trend ${currentPosition}`} style={{ left: `${popPos.trendLeft}px`, top: `${popPos.trendTop}px` }}></div>}
            </div>

          </CSSTransition>
          {showMask && show && <div className={`h-pop-mask ${mask === 'opacity' ? 'opacity' : ''}`} onClick={unpop}></div>}

        </>
        , el)}
    </div>
  )
}


const cretaeEl = () => {
  const el = document.createElement('div');
  el.classList.add('h-pop-content-wrap');
  return el;
}



export default Pop;