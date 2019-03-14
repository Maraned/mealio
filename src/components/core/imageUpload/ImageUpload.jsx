import React, { useState } from 'react';
import cc from 'classcat';

import './imageUpload.css';

import { useTranslation } from 'react-i18next';

const ImageUpload = ({ onDrop, className }) => {
  const [droppedFiles, setDroppedFiles] = useState(null);
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
    const files = event.dataTransfer.files;
    if (onDrop) {
      onDrop(files);
    } else {
      setDroppedFiles(files);
    }
    setIsDraggingOver(false);
  } 

  return (
    <form 
      className={cc(['imageUpload', className, {
        'imageUpload--isDragOver': isDraggingOver
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
      <div className="imageUpload__input">
        <input 
          className="imageUpload__file" 
          type="file" 
          name="files[]" 
          id="file" 
          multiple 
        />
        
        <label for="file">
          <strong className="imageUpload__chooseImage">{t('Recipe:ChooseImage')}</strong>
          <span className="imageUpload__dragndrop">
            &nbsp;{t('Recipe:OrDragItHere')}
          </span>.
        </label>
      </div>

      <div className="imageUpload__uploading">Uploading&hellip;</div>
      <div className="imageUpload__success">Done!</div>
      <div className="imageUpload__error">Error! <span></span>.</div>
    </form>
  )
}

export default ImageUpload;
