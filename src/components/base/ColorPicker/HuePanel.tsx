import React, { FC, useState, useEffect, useRef } from 'react'
import draggable from './draggable'
type SuePanelProps = {
  color: obj,
  colorChange: (color: obj) => void
}

const HuePanel: FC<SuePanelProps> = ({ color, colorChange }) => {
  const [thunmTop, setthunmTop] = useState(0);
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
    const barHeight = bar.current.clientHeight;
    const top = barHeight * color._hue / 360;
    setthunmTop(top);
  }, [color._hue])

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
    const barHeight = bar.current.clientHeight;
    const rect = bar.current.getBoundingClientRect();
    const top = Math.min(Math.max(0, e.pageY - rect.top), barHeight);
    const hue = +(top / barHeight * 360).toFixed(2);
    setthunmTop(top);
    color.set({
      hue
    })
    colorChange(color);
  }

  return (
    <div className="color-pikcer__panel_hue">
      <div ref={bar} className="hue_bar"></div>
      <div ref={thumb} className="hue_thumb" style={{ top: `${thunmTop}px` }}></div>
    </div>
  )
}

export default HuePanel;