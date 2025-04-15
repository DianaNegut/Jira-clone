import React, { useState, useEffect, useCallback } from 'react';
import './Middle.css';
import { assets } from '../../assets/assets';

const Middle = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const carouselImages = [
    assets.carusel1,
    assets.carusel2,
    assets.carusel3
  ];

 
  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  }, [carouselImages.length]);


  const prevImage = useCallback(() => {
    setCurrentImage((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  }, [carouselImages.length]);


  useEffect(() => {
    console.log("Setting up interval, current image:", currentImage);
    const interval = setInterval(() => {
      nextImage();
    }, 5000); 

    return () => clearInterval(interval); 
  }, [nextImage]);

  return (
    <div className='middle'>
      <h1>Adu toate echipele împreună sub același acoperiș.</h1>
      <p>Petrece mai puțin timp încercând să te aliniezi și mai mult timp avansând proiectele cu încredere.</p>
      
      <div className="carousel">
        <button className="carousel-button prev" onClick={prevImage}>
          &lt;
        </button>
        
        <div className="carousel-container">
          {carouselImages.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Carousel image ${index + 1}`}
              className={`carousel-image ${index === currentImage ? 'active' : ''}`}
            />
          ))}
        </div>
        
        <button className="carousel-button next" onClick={nextImage}>
          &gt;
        </button>
        
        <div className="carousel-dots">
          {carouselImages.map((_, index) => (
            <span 
              key={index} 
              className={`carousel-dot ${index === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(index)}
            ></span>
          ))}
        </div>
      </div>
      
      <img src={assets.teams} alt="Teams" className='middle-image'/>
    </div>
  );
};

export default Middle;