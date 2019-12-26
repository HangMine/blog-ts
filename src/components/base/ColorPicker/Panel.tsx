import React, { FC, useState, useEffect } from 'react'

import SvPanel from './SvPanel';
import HuePanel from './HuePanel';
import AlphaPanel from './AlphaPanel';
import PreColor from './PreColor';

type PanelProps = {
  color: obj,
  colorChange: (color: obj) => void,
  showAlpha?: boolean,
  preColors?: string[],
  [any: string]: any
}
const Panel: FC<PanelProps> = ({ color, format, colorChange, showAlpha, preColors, ...ohterProps }) => {
  return (
    <div className="color-picker__panel" {...ohterProps}>
      <HuePanel color={color} colorChange={colorChange}></HuePanel>
      <SvPanel color={color} colorChange={colorChange}></SvPanel>
      {showAlpha && <AlphaPanel color={color} colorChange={colorChange}></AlphaPanel>}
      {preColors && <PreColor color={color} colorChange={colorChange} preColors={preColors} ></PreColor>}
    </div>
  )
}

export default Panel;