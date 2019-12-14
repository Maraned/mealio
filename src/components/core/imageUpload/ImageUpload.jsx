import React, { useState, useEffect } from 'react';
import cc from 'classcat';

import './imageUpload.css';

import { useTranslation } from 'react-i18next';

const ImageUpload = ({ onDrop, className, circle, id, size, uploadedImage }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { t } = useTranslation();

  const onDragOver = event => {
    event.preventDefault();
    setIsDraggingOver(true);
  }

  const onDragLeave = event => {
    event.preventDefault();
    setIsDraggingOver(false);
  }

  const onFilesDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (onDrop) {
      onDrop(files);
    }
    setIsDraggingOver(false);
  } 

  const onChange = event => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.target.files;
    if (onDrop) {
      onDrop(files);
    }
  };

  const uploadedImageStyle = size ? {
    width: `${size}px`,
    height: `${size}px`,
  } : {};

  return (
    <form 
      className={cc(['imageUpload', className, {
        'imageUpload--isDragOver': isDraggingOver,
        'imageUpload--circle': circle
      }])}
      method="post" 
      action="" 
      encType="multipart/form-data"
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragLeave}
      onDrop={onFilesDrop}
    >
      <div className="imageUpload__input flex center vcenter">
        <div className="imageUpload__uploadedImage" style={uploadedImageStyle}>
          {!!uploadedImage && (
            <img className="image--rounded" src={uploadedImage} />
          )}
        </div>

        <input 
          className="imageUpload__file" 
          type="file" 
          id={id}
          onChange={onChange} 
          multiple 
        />
        
        <label htmlFor={id} className="imageUpload__label flex vcenter center">
          <strong className="imageUpload__chooseImage">{t('Recipe:ChooseImage')}</strong>
          <span className="imageUpload__dragndrop">
            &nbsp;{t('Recipe:OrDragItHere')}
          </span>
        </label>
      </div>

      {circle && (
        <svg className="imageUpload__circleOutline" width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#c8c8c8" strokeWidth="3" strokeDasharray="10 6" fill="transparent"/>
        </svg>
      )}

      <div className="imageUpload__uploading">Uploading&hellip;</div>
      <div className="imageUpload__success">Done!</div>
      <div className="imageUpload__error">Error! <span></span>.</div>
    </form>
  )
}

export default ImageUpload;
