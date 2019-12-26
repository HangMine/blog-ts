import React, { FC, useState, useRef, useEffect, createElement } from 'react';
import http from '@/assets/js/http'
type ImgUploadPanelProp = {
  type?: 'src' | 'file', //是传src还是文件
  src?: string,
  uploadUrl?: string,
  formData?: any,
  isSuccess?: boolean,
  isError?: boolean,
  onOk?: (res: res) => void,
  onError?: (res: res) => void
}

// 图片上传组件
const ImgUploadPanel: FC<ImgUploadPanelProp> = ({ type = 'src', src, uploadUrl, formData, isSuccess = false, isError = false, onOk, onError }) => {
  useEffect(() => {
    // 上传到服务端
    if (uploadUrl && src) {
      const params = type === 'src' ? { src } : formData;
      http.post(uploadUrl!, params).then((res: any) => {
        onOk!(res);
      }).catch(err => {
        onError!(err)
      })
    }
  }, [])
  return (
    <>
      {
        !isSuccess ? <div className="img-upload-panel">
          <img className="left" src={src} />

          <span className="right">
            <img src={require('@/assets/img/uploading.gif')} alt="uploading" />
            <span className="btn-group">
              {isError && <span className="tip">上传失败</span>}
              <span className="reupload">重新上传</span>
              <span className="cancel">取消</span>
            </span>

          </span>
        </div>
          :
          <img src={src} alt="" />
      }

    </>
  )
}

export default ImgUploadPanel;