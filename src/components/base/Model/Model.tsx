import React, { FC, useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom';
import { Button, Icon } from 'antd';
import './Model.scss';
type ModelProps = {
  visable: boolean,
  title?: string,
  onOK?: () => void,
  onCancel: () => void
}

const Model: FC<ModelProps> = ({ children, visable, title, onOK, onCancel }) => {

  const [el, setel] = useState(document.createElement('div'));
  useEffect(() => {
    if (!visable) return;
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    }
  }, [visable])

  // 点击遮罩层
  const clickMask = () => {
    onCancel();
  }

  return createPortal(
    <>
      {
        <div className="h-model-wrap">

          <div className="h-model-overflow-wrap">
            <div className="h-model-mask" onClick={clickMask}></div>
            <div className="h-model">
              <div className="h-model-header">
                {title ? title : '标题'}
                <div className="h-model-close" onClick={onCancel}>
                  <Icon type="close" />
                </div>

              </div>
              <div className="h-model-body">
                {children ? children : '请传入子元素'}
              </div>
              <div className="h-model-footer">
                <Button className="h-model-footer-button" onClick={onCancel}>取消</Button>
                {onOK && <Button className="h-model-footer-button" type="primary" onClick={onOK}>确定</Button>}
              </div>
            </div>
          </div>
        </div>
      }

    </>,
    el
  )
}

export default Model;