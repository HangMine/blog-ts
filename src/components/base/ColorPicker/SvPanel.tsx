import React, { FC, useState, useEffect, useRef } from 'react'
import draggable from './draggable'
type SvPanel = {
  color: obj,
  colorChange: (color: obj) => void
}

const SvPanel: FC<SvPanel> = ({ color, colorChange }) => {

  const sv: any = useRef(null);
  useEffect(() => {
    draggable(sv.current, {
      start: handleDrag,
      drag: handleDrag,
      end: handleEnd
    })
  }, [])

  // const [bgColor, setbgColor] = useState(color.value);
  // useEffect(() => {
  //   setbgColor(color.value)
  // }, [color.value])

  const [cursorPos, setcursorPos] = useState({
    left: 0,
    top: 0
  })
  useEffect(() => {

    const { _saturation, _value } = color;
    const { clientWidth, clientHeight } = sv.current;

    const left = clientWidth * _saturation / 100;
    const top = clientHeight * (100 - _value) / 100;
    setcursorPos({
      left,
      top
    });
  }, [color._saturation, color._value])


  const handleDrag = (e: any) => {
    update(e)
  }

  const update = (e: any) => {
    const rect = sv.current.getBoundingClientRect();
    const left = Math.max(0, Math.min(e.pageX - rect.left, rect.width));
    const top = Math.max(0, Math.min(e.pageY - rect.top, rect.height));

    const saturation = +(left / rect.width * 100).toFixed(2);
    const value = +(100 - (top / rect.height * 100)).toFixed(2);
    setcursorPos({
      left,
      top
    });
    color.set({
      saturation,
      value
    })
    colorChange(color);
  }

  const handleEnd = (e: any) => {

  }

  const getBgcolor = () => {
    return 'hsl(' + color.get('hue') + ', 100%, 50%)';
  }

  return (
    <div ref={sv} className="color-pikcer__panel_sv" style={{ background: getBgcolor() }}>
      <div className="panel-mask color-pikcer__panel_sv_white"></div>
      <div className="panel-mask color-pikcer__panel_sv_black"></div>
      <div className="color-pikcer__panel_sv_cursor" style={cursorPos}></div>
    </div>
  )
}

export default SvPanel;