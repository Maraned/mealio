import React, { useRef, useState, useEffect } from 'react';
import posed, { PoseGroup } from 'react-pose';
import cc from 'classcat';

import { useTranslation } from 'react-i18next';

import './imageOrder.css';

const ImageOrder = ({ images, className, onOrderChange }) => {
  const containerRef = useRef(null);
  const [mapImages, setMapImages] = useState([]);
  const [imageSources, setImageSources] = useState([]);
  const { t } = useTranslation();

  const movedElem = useRef(null);
  const nextElem = useRef(null);
  const prevElem = useRef(null);

  const prevRightBound = useRef(0);
  const nextLeftBound = useRef(0);
  const originPos = useRef(0);
  const originWidth = useRef(0);

  useEffect(() => {
    setImageSources(images);
    // setMapImages(images);
  }, [images]);

  // useEffect(() => {
  //   setSourcesFromImages();
  // }, [mapImages]);

  // const setSourcesFromImages = () => {
  //   const sources = [];
  //   let imagesLoaded = 0;
  //   for (let i = 0; i < mapImages.length; i++) {
  //     const image = mapImages[i];
  //     let reader = new FileReader();
  //     reader.addEventListener('load', () => {
  //       imagesLoaded += 1;
  //       sources[i] = reader.result;
  //       if (mapImages.length === imagesLoaded) {
  //         setImageSources(sources);
  //       }
  //     })
  //     reader.readAsDataURL(image);
  //   }
  // }

  const onDragStart = event => {
    const dragRect = event.target.getBoundingClientRect();
    originWidth.current = dragRect.width;
    originPos.current = dragRect.left;

    const prevSibling = event.target.previousSibling;
    prevElem.current = prevSibling;
    prevRightBound.current = 0;
    if (prevSibling) {
      const rect = prevSibling.getBoundingClientRect();
      prevRightBound.current = rect.right;
    }

    const nextSibling = event.target.nextSibling;
    nextElem.current = nextSibling;
    nextLeftBound.current = 0;
    if (nextSibling) {
      const rect = nextSibling.getBoundingClientRect();
      nextLeftBound.current = rect.left;
    }
    movedElem.current = event.target;
  }

  const onDrag = index => x => {
    const leftBound = originPos.current + x;
    const rightBound = leftBound + originWidth.current;

    if (nextLeftBound.current && rightBound > nextLeftBound.current) {
      swapImages(index, index + 1);
    } else if (prevRightBound.current && leftBound < prevRightBound.current) {
      swapImages(index, index - 1);
    }
  }

  const swapImages = (draggedElemIndex, swapIndex) => {
    const reordered = [...mapImages];
    const draggedImage = mapImages[draggedElemIndex];
    const swapImage = mapImages[swapIndex];
    reordered.splice(draggedElemIndex, 1, swapImage);
    reordered.splice(swapIndex, 1, draggedImage);
    onOrderChange(reordered);
  }

  return (
    <div
      ref={containerRef} 
      className={cc(['imageOrder', className])}
    >
      <PoseGroup>
        {images.map((file, index) => {
          const ImageBox = posed.div({
            draggable: 'x',
            dragEnd: { x: 0 },
            dragBounds: { 
              left: index === 0 ? 0 : -100, 
              right: index === mapImages.length - 1 ? 0 : 100
            },
          });

          return (
            <ImageBox
              key={`${index}:${file.name}`} 
              poseKey={`${index}:${file.name}`}
              className="imageOrder__file"
              onDragStart={onDragStart}
              onValueChange={{ x: onDrag(index) }}
            >
              <img src={imageSources[index]} />
            </ImageBox>
          )
        })}
      </PoseGroup>
    </div>
  )
}

export default ImageOrder;
