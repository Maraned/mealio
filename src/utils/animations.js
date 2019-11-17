import posed, { PoseGroup } from 'react-pose';

const SlideInOut = posed.div({
  enter: { 
    opacity: 1,
    y: '0',
  },
  exit: { 
    opacity: 0,
    y: '-100%',
  },
});

export default {
  SlideInOut
}
