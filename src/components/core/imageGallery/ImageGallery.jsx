import React, { useEffect, useState } from 'react';
import cc from 'classcat';

import './imageGallery.css';

import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

const ImageGallery = ({ images, className }) => {
  const [imageSources, setImageSources] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(1);
  const showArrows = images.length > 1;
  const [animate, setAnimate] = useState(false);

  const setSourcesFromImages = () => {
    const sources = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let reader = new FileReader();
      reader.addEventListener('load', () => {
        sources.push(reader.result);
        if (images.length === sources.length) {
          setImageSources(sources);
        }
      })
      reader.readAsDataURL(image);
    }
  } 

  useEffect(() => {
    setSourcesFromImages();
  }, [images]);

  const slideLeft = newIndex => () => {
    setAnimate('slideLeft');
    setTimeout(() => {
      let last = imageSources.slice(-1);
      let rest = imageSources.slice(0, -1)
      let images = [last, ...rest];
      setAnimate(false);
      setImageSources(images);
    }, 500);
  }

  const slideRight = newIndex => () => {
    setAnimate('slideRight');
    setTimeout(() => {
      let [first, ...rest] = imageSources;
      let images = [...rest, first];
      setAnimate(false);
      setImageSources(images);
      setGalleryIndex(1);
    }, 500);
  }

  return (
    <div className={cc(['imageGallery', className])}>
      {showArrows && (
        <FaCaretLeft 
          onClick={slideLeft(galleryIndex - 1)} 
          className="imageGallery__arrow imageGallery__arrow--left" 
        />
      )}

      <div className="imageGallery__images">
        {imageSources.map((image, index) => {
          return (
            <img
              className={cc([{
                'imageGallery__animate': animate,
                'imageGallery__slideLeft': animate === 'slideLeft',
                'imageGallery__slideRight': animate === 'slideRight',
              }])} 
              src={image} 
            />
          )
        })}
      </div>

      {showArrows && (
        <FaCaretRight
          onClick={slideRight(galleryIndex + 1)} 
          className="imageGallery__arrow imageGallery__arrow--right" 
        />
      )}
    </div>
  )
}

export default ImageGallery;
