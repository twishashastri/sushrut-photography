import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { heroImages } from '../../dummy-data/images';

// STYLED COMPONENTS - Adding them one by one

// 1. Basic section wrapper
const HeroSection = styled.section`
  height: 90vh;
  min-height: 600px;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.primary};
`;

// 2. Slide container with motion
const SlideContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// 3. Individual slide
const Slide = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(10, 35, 66, 0.7) 0%,
      rgba(10, 35, 66, 0.3) 100%
    );
  }
`;

// 4. Content container
const Content = styled.div`
  position: absolute;
  bottom: 15%;
  left: 10%;
  color: ${({ theme }) => theme.colors.white};
  z-index: 10;
  max-width: 600px;

  h3 {
    color: ${({ theme }) => theme.colors.white};  // Make sure h3 is white
    margin: 0;
  }
`;

// 5. Photographer info with motion
const PhotographerInfo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  h3 {
    color: ${({ theme }) => theme.colors.white};  // Make sure this is white
  }
`;

// 6. Profile image
const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.secondary};
  object-fit: cover;
`;

// 7. Quote with motion
const Quote = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.white};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
  }
`;

// 8. Slide indicators
const SlideIndicators = styled.div`
  position: absolute;
  bottom: 5%;
  right: 5%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  z-index: 10;
`;

// 9. Indicator buttons (using transient prop $active)
const Indicator = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.secondary : theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: scale(1.2);
  }
`;

// Animation variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: 0.8,
    },
  }),
};

function Hero() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [autoplay, setAutoplay] = useState(true);

  const imageIndex = Math.abs(page % heroImages.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [page, autoplay, paginate]);

  return (
    <HeroSection>
      <AnimatePresence initial={false} custom={direction}>
        <SlideContainer
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <Slide bg={heroImages[imageIndex].url} />
        </SlideContainer>
      </AnimatePresence>

      <Content>
        <PhotographerInfo
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ProfileImage src={heroImages[imageIndex].profilePic} alt="Photographer" />
          <h3>{heroImages[imageIndex].photographer}</h3>
        </PhotographerInfo>
        
        <Quote
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          "{heroImages[imageIndex].quote}"
        </Quote>
      </Content>

      <SlideIndicators>
        {heroImages.map((_, index) => (
          <Indicator
            key={index}
            $active={index === imageIndex}
            onClick={() => {
              const newDirection = index > imageIndex ? 1 : -1;
              setPage([index, newDirection]);
              setAutoplay(false);
              setTimeout(() => setAutoplay(true), 10000);
            }}
          />
        ))}
      </SlideIndicators>
    </HeroSection>
  );
}

export default Hero;