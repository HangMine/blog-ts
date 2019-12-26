import React, { FC, useState, useEffect } from 'react'
import Pop from '@/components/base/Pop/Pop'
import Panel from './Panel'
import Color from './color'
import { Input, Button, Icon } from 'antd'
import './ColorPicker.scss'

type ColorPickerProps = {
  showAlpha?: boolean,
  preColors?: string[],
  defaultValue?: string,
  format?: 'hsl' | 'hsv' | 'hex' | 'rgb',
  size?: 'medium' | 'small' | 'mini',
  mask?: boolean | 'opacity'
  offset?: {
    left?: number,
    top?: number,
    right?: number,
    bottom?: number
  },
  onOk?: (colorValue: string) => void,
  onReset?: (colorValue: string) => void,
}

const ColorPicker: FC<ColorPickerProps> = ({ children, showAlpha, preColors, defaultValue, format, size, mask, offset, onOk, onReset }) => {
  // 如果有预设面板，format为rgba
  const currentFormat = preColors ? 'rgb' : format;
  const [color, setcolor] = useState(new Color({ enableAlpha: showAlpha, format: currentFormat }));
  const [paneShow, setpaneShow] = useState(false)
  const [colorValue, setcolorValue] = useState(defaultValue || '');

  const colorChange = (color: any) => {
    setcolor(color);
    setcolorValue(color.value)
  }


  const ok = () => {
    onOk && onOk(colorValue);
    setpaneShow(false);
    color.fromString(colorValue);
  }

  const reset = () => {
    onReset && onReset(colorValue);
    setcolorValue('');
    setpaneShow(false);
  }

  // 显示按钮背景颜色
  const getBgColor = () => {
    if (!colorValue) return 'transparent';
    if (format = 'hsv') {
      // hsv的值浏览器不显示，特殊处理
      const c = new Color({ enableAlpha: showAlpha });
      c.fromString(colorValue);
      return c.value;
    } else {
      return colorValue;
    }
  }

  // 大小
  const getSize = () => {
    switch (size) {
      case 'medium':
        return {
          width: 36,
          height: 36
        }
      case 'small':
        return {
          width: 32,
          height: 32
        }
      case 'mini':
        return {
          width: 28,
          height: 28
        }

      default:
        break;
    }
  }

  const content = (
    <div className="coloe-picker__panel_wrap">
      <Panel color={color} colorChange={colorChange} showAlpha={showAlpha} preColors={preColors}></Panel>

      <div className="color-picker__bottom">
        <Input className="color-input" value={colorValue} onChange={e => setcolorValue(e.target.value)}></Input>
        <span className="btn-group">
          <Button type="link" onClick={reset}>清除</Button>
          <Button onClick={ok}>确定</Button>
        </span>
      </div>
    </div>
  )
  return (
    <div className="h-color-picker">
      <Pop visible={paneShow} content={content} mask="opacity" offset={offset} onVisibleChange={visible => setpaneShow(visible)}>
        {/* 显示按钮 */}
        {children ||
          <div className="color-picker__btn" style={getSize()}>
            <div className="color-picker__show" style={{ background: getBgColor() }}></div>
            <Icon type={colorValue ? "down" : "close"} />
          </div>}
      </Pop>
    </div>
  )
}

export default ColorPicker;