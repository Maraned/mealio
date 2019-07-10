import './pie.css';

import React, { useState } from 'react';
import Checkbox from 'components/core/Checkbox';

const segmentColors = [
  '#788006',
  '#D5322B',
  '#1476CC',
  '#909900',
  '#004480',
]

export default function Pie({
  segments,
  size,
  title,
}) {  
  const [pieSegments, setPieSegments] = useState(segments);
  let offset = 0;

  const disablePieSegment = (segment, index) => () => {
    const modifiedPieSegments = [...pieSegments];
    segment.disabled = !segment.disabled;
    modifiedPieSegments[index] = segment;
    setPieSegments(modifiedPieSegments);
  }

  return (
    <div className="pieContainer">
      {title && (
        <h2 className="pie__title">{title}</h2>
      )}
      <div className="pie" style={{ height: `${size}rem`, width: `${size}rem` }}>
        {pieSegments.map((segment, index) => {
          console.log('!disabled', !segment.disabled)
          if (segment.disabled) {
            return '';
          }

          console.log('value', segment.value)

          const value = isNaN(segment.value) ? 0 : segment.value;
          const currentOffset = offset;

          const segmentStyle = {
            '--offset': currentOffset,
            '--value': value,
            '--bg': segmentColors[index],
          }
          offset += value;

          if (value > 50) {
            segmentStyle['--over50'] = 1;
          }

          return (
            <div className="pie__segment" style={segmentStyle} />
          )
        })}
      </div>

      {pieSegments.map((segment, index) => (
        <div className="pie__segmentDescription" onClick={disablePieSegment(segment)}>
          <Checkbox 
            value={!segment.disabled}
            showIcon={false}
            checkedBackgroundColor={segmentColors[index]}
            backgroundColor="#fff"
          />
          <span className="pie__segmentLabel">{segment.label}</span>
        </div>
      ))}
    </div>

  );
}