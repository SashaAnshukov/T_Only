import { useRef, useState } from 'react';
import useWindowWidth from "../../hooks/useWindowWidth";
import { EllipseProps, TimePeriod } from '../../types';

import {gsap} from 'gsap';
import { useGSAP } from '@gsap/react';
//import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(useGSAP)

import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';

import './ellipse.scss';

const Ellipse : React.FC<EllipseProps> = ({ 
  periods,
}) => {
  const windowWidth = useWindowWidth();
  const [activePeriodIndex, setActivePeriodIndex] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [rotationComplete, setRotationComplete] = useState<boolean>(true);

  const circleRef = useRef<HTMLDivElement>(null);
  const startYearRef = useRef<HTMLDivElement>(null);
  const endYearRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  const container = useRef<HTMLDivElement>(null);

  const activePeriod = periods[activePeriodIndex];
  const totalPeriods = 6; //6
  const angleStep = 360 / totalPeriods; //60

  const getDotPosition = (index: number) => {
    const angle = (360 / totalPeriods) * index - 90;
    const angleRad = (angle * Math.PI) / 180; // первод угла из градусов в радианы
    const radius = windowWidth > 1200 ? 265 : 223;
    
    const x = Math.cos(angleRad) * radius; // координату X на окружности.
    const y = Math.sin(angleRad) * radius; // координата Y на окружности.
    
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`
    };
  };

  const animateNumber = (element: HTMLElement, from: number, to: number) => {
    const obj = { value: from };
    gsap.to({ value: from }, {
      value: to,
      duration: 1,
      ease: "slow",
      onUpdate: function() {
        element.textContent = obj.value.toString();
      }
    });
  };

  const handlePeriodChange = (index: number) => {
    if (index === activePeriodIndex) return;

    const newRotation = -angleStep * (index-1);
    setRotationComplete(false);
    setRotation(newRotation);

    // поворот круга
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        rotation: newRotation,
        duration: 1,
        ease: "slow",
      });
    }

    // поворот точек
    dotsRef.current.forEach((dot, idx) => {
      if (dot) {
        gsap.to(dot, {
          rotation: -newRotation,
          duration: 1,
          ease: "slow",
          onComplete: () => {
            setRotationComplete(true);
          },
        });
      }
    });

    if (startYearRef.current && endYearRef.current) {
      setActivePeriodIndex(index);
      animateNumber(
        startYearRef.current, 
        activePeriod.startYear, 
        periods[index].startYear
      );
      animateNumber(
        endYearRef.current, 
        activePeriod.endYear, 
        periods[index].endYear
      );
    } else {
      setActivePeriodIndex(index);
    }

    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
  };

  
  const handleNext = () => {
    let nextIndex = activePeriodIndex + 1;
    if (nextIndex >= totalPeriods) {
      nextIndex = 0;
    }
    handlePeriodChange(nextIndex);
  };

  const handlePrev = () => {
    let prevIndex = activePeriodIndex - 1;
    if (prevIndex < 0) {
      prevIndex = totalPeriods - 1;
    }
    handlePeriodChange(prevIndex);
  };

  return (
    <section className="ellipse">
      <div className="ellipse__divider-vertical"></div>
      <h2 className="ellipse__title">
        Исторические<br />даты
      </h2>
      <div ref={container} className="ellipse__circle-wrapper">
        <div className="divider-horizontal"></div>
        <div 
          className="ellipse__circle"
          ref={circleRef}
        > 
          {periods.map((period, index) => {
            const position = getDotPosition(index);
            const isActive = index === activePeriodIndex;
            
            return (
              <div
                key={period.id}
                className={`ellipse__dot ${isActive ? 'active' : ''}`}
                style={position}
                ref={(el) => {
                  if (el) dotsRef.current[index] = el;
                }}
                onClick={() => handlePeriodChange(index)}
                // onMouseEnter={onEnter}
                // onMouseLeave={onLeave}
              >
                <div className="ellipse__dot-inner">
                  <span className="ellipse__dot-number">{index + 1}</span>
                  {rotationComplete && 
                    <span className="ellipse__dot-label">
                      {period.category}
                    </span>
                  }
                </div>
                
              </div>
            );
          })}
        </div>
        <div className="ellipse__years">
          <p 
            className="ellipse__year ellipse__year-start" 
            ref={startYearRef}
          >
            {activePeriod.startYear}
          </p>
          <p 
            ref={endYearRef}
            className=" ellipse__year ellipse__year-end"
          >
            {activePeriod.endYear}
          </p> 
        </div>
      </div>

      

      <div className="slider">

        <div className="ellipse__navigation">
          <div className="ellipse__navigation-activeItem">
            {`${"0"+(activePeriodIndex+1)}`}/{`${"0"+totalPeriods}`}
          </div>
          <div className="ellipse__navigation-btns">
            <button 
              className="ellipse__navigation-btns-prev" 
              aria-label="Предыдущий период"
              onClick={handlePrev}>
            </button>
            <button
              className="ellipse__navigation-btns-next"  
              aria-label="Следующий период"
              onClick={handleNext}>
            </button>
            <div className="swiper-pagination"/>
          </div>
        </div>

        <div className="prev-swiper-button"></div>
        <Swiper
          modules={[Navigation, Pagination]}
          grabCursor={true}
          watchSlidesProgress={true}
          spaceBetween={windowWidth > 768 ? 80 : 25}
          // slidesPerView={
          //   windowWidth > 1440 ? 3 : 
          //   windowWidth > 768 ? 2 :
          //   1.2
          // }
          breakpoints={{
            320: { slidesPerView: "auto", spaceBetween: 25 },
            768: { slidesPerView: "auto", spaceBetween: 80 },
          }}
          navigation={{
            nextEl: '.next-swiper-button',
            prevEl: '.prev-swiper-button',
            disabledClass: 'button-disabled'
          }}
          autoHeight={true}
          pagination={{
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
          }}
        >
          {activePeriod.events.map((event, index) => (
            <SwiperSlide
              key={index}
              className="slider__container"
            >
              <div className="slider__container-info">
                  <div className="ellipse__event-year">
                    {event.year}
                  </div>
                  <div className="ellipse__event-text">
                    {event.description}
                  </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="next-swiper-button"></div>
      </div>
    </section>
  );
};

export default Ellipse;