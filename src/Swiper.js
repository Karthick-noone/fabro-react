import React, { useEffect } from 'react';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import './css/swiper-bundle.min.css';
import GLightbox from 'glightbox';

// Import your images
import photo1 from './img/about/p1.jpg';
import photo2 from './img/about/p2.jpg';
import photo3 from './img/about/p3.jpg';
import photo4 from './img/about/p4.jpg';
import photo5 from './img/about/p5.jpg';
import photo6 from './img/about/p6.jpg';
import photo7 from './img/about/recent-photos-7.jpg';
import photo8 from './img/about/recent-photos-4.jpg';

// Initialize Swiper core components
SwiperCore.use([Pagination, Navigation]);

const RecentPhotos = () => {
    useEffect(() => {
      const lightbox = GLightbox({ selector: '.glightbox' });
  
      return () => {
        // Clean up the lightbox instance when the component is unmounted
        lightbox.destroy();
      };
    }, []); // Empty dependency array means this effect will run once when the component mounts
  
    const images = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8];
  
    return (
      <section id="recent-photos" className="recent-photos">
        <Swiper
          className="recent-photos-slider swiper"
          slidesPerView={4}
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <a href={image} className="glightbox">
                {/* Use 'img' tag instead of 'image' */}
                <img
                  src={image}
                  alt={`Recent Photo ${index + 1}`}
                  className="img-fluid"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };
  
  export default RecentPhotos;