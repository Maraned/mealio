import React, { useEffect, useState, useRef } from 'react';
import cc from 'classcat';

import posed, { PoseGroup } from 'react-pose';

import './imageGallery.css';

import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

const ImageGallery = ({ images, className }) => {
  const [imageSources, setImageSources] = useState([]);
  const showArrows = images.length > 1;
  const galleryIndex = useRef(0);
  const clickedDirection = useRef('');

  const setSourcesFromImages = () => {
    const sources = [];
    let imagesLoaded = 0;
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let reader = new FileReader();
      reader.addEventListener('load', () => {
        imagesLoaded += 1;
        sources[i] = reader.result;
        if (images.length === imagesLoaded) {
          setImageSources(sources);
        }
      })
      reader.readAsDataURL(image);
    }
  } 

  useEffect(() => {
    setSourcesFromImages();
  }, [images]);

  const slideLeft = () => {
    const last = imageSources.slice(-1);
    const rest = imageSources.slice(0, -1)
    const images = [last, ...rest];
    galleryIndex.current += 1;
    clickedDirection.current = 'left';
    setImageSources(images);
  }

  const slideRight = () => {
    const [first, ...rest] = imageSources;
    const images = [...rest, first];
    galleryIndex.current += 1;
    clickedDirection.current = 'right';
    setImageSources(images);
  }

  const ImageSlide = posed.img({
    enter: {
      x: 0,
      transition: {
        duration: 600,
      }
    },
    exit: {
      x: clickedDirection.current === 'left' ? '-100%' : '100%',
      transition: {
        duration: 600,
      }
    }
  });

  const renderArrow = (direction, onClick) => {
    const ArrowIcon = direction === 'left'
      ? FaCaretLeft 
      : FaCaretRight;

    return (
      <div className="imageGallery__arrowContainer">
      {showArrows && (
        <ArrowIcon 
          onClick={onClick} 
          className={`imageGallery__arrow imageGallery__arrow--${direction}`}
        />
      )}
    </div>
    );
  };

  const renderImages = () => (
    <div className="imageGallery__images">
      <div className="imageGallery__images__innerContainer">
        <PoseGroup>
          <ImageSlide 
            key={'lastImage' + galleryIndex.current} 
            className="imageGallery__slide" 
            src={imageSources[imageSources.length - 1]} 
          />

          {imageSources.map((image, index) => (
            <ImageSlide 
              key={galleryIndex.current + '' + index} 
              className="imageGallery__slide" src={image} 
            />
          ))}
        </PoseGroup>
      </div>
    </div>
  );

  return (
    <div className={cc(['imageGallery', className])}>
      {renderArrow('left', slideLeft)}

      {renderImages()}

      {renderArrow('right', slideRight)}
    </div>
  )
}

export default ImageGallery;
