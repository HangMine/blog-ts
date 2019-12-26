import React, { FC, useState, useEffect, useRef } from 'react'
import draggable from './draggable'
type AlphaPanel = {
  color: obj,
  colorChange: (color: obj) => void
}

const AlphaPanel: FC<AlphaPanel> = ({ color, colorChange }) => {
  const [thumbLeft, setthumbLeft] = useState();
  const bar: any = useRef(null);
  const thumb: any = useRef(null);

  useEffect(() => {
    draggable(bar.current, {
      start: handleStart,
      drag: handleDrag,
      end: handleEnd
    })
    draggable(thumb.current, {
      drag: handleDrag,
      end: handleEnd
    })
  }, [])

  useEffect(() => {
    const barWidth = bar.current.clientWidth;
    const left = barWidth * color._alpha / 100;
    setthumbLeft(left);
  }, [color._alpha])

  const handleStart = (e: any) => {
    update(e);
  }

  const handleDrag = (e: any) => {
    update(e);
  }

  const handleEnd = (e: any) => {
    console.log(e);
  }

  const update = (e: any) => {
    const barWidth = bar.current.clientWidth;
    const rect = bar.current.getBoundingClientRect();
    const left = Math.min(Math.max(0, e.pageX - rect.left), barWidth);
    const alpha = Math.round(left / barWidth * 100);
    setthumbLeft(left);
    color.set({
      alpha
    })
    colorChange(color);
  }

  const getBackground = () => {
    const { r, g, b } = color.toRgb();
    return { background: `linear-gradient(to right, rgba(${r},${g},${b},0), rgba(${r},${g},${b},1)` }
  }

  return (
    <div className="color-pikcer__panel_alpha">
      <div ref={bar} className="alpha_bar" style={getBackground()}></div>
      <div ref={thumb} className="alpha_thumb" style={{ left: `${thumbLeft}px` }}></div>
    </div>
  )
}

export default AlphaPanel;