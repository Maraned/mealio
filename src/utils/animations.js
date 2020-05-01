import posed, { PoseGroup } from 'react-pose';

export const SlideInOut = posed.div({
  enter: { 
    opacity: 1,
    y: '0',
  },
  exit: { 
    opacity: 0,
    y: '-100%',
  },
});

export const FadeIn = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 },
});

