import React, { FC, useState, useEffect } from 'react'
import Color from './color';
import usePrevious from '@/components/use/usePrevious';
type PreColor = {
  color: obj,
  colorChange: (color: obj) => void,
  preColors: string[]
}
const PreColor: FC<PreColor> = ({ color, colorChange, preColors }) => {
  // 现在cuurentPreColors存放rgba字符串，后续考虑改为color对象
  const [currentPreColors, setcurrentPreColors]: [string[], any] = useState([])
  const [selectedIndex, setselectedIndex] = useState();

  useEffect(() => {
    const c = new Color({ enableAlpha: true });
    const currentPreColors = preColors.map(preColor => {
      c.fromString(preColor);
      return c.value;
    })
    setcurrentPreColors(currentPreColors);
  }, [])

  useEffect(() => {
    const selectedIndex = currentPreColors.findIndex(preColor => preColor === color.value);
    setselectedIndex(selectedIndex);
  }, [color.value, currentPreColors])

  const setColor = (colorValue: string, selectedIndex: number) => {
    setselectedIndex(selectedIndex);
    color.fromString(colorValue);
    colorChange(color)
  }

  const isAlpha = (colorValue: string) => {
    const alpha = parseFloat(colorValue.trim().split(',')[3].slice(0, -1));
    return alpha < 1;
  }


  return (
    <ul className="color-pikcer__panel_pre-color">
      {currentPreColors.map((colorValue, i) =>
        <li key={i} className={`${isAlpha(colorValue) ? 'is-alpha' : ''} ${selectedIndex === i ? 'selected' : ''}`} onClick={() => setColor(colorValue, i)} >
          <div style={{ backgroundColor: colorValue }}></div>
        </li>
      )}
    </ul>
  )
}

export default PreColor;
