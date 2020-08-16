import React, { useMemo } from 'react';

export default function Fork({ size }) {
  const pinWidth = 4;
  const forkTopStartX = 11;
  const forkTopLength = pinWidth * 7;
  const forkBodyX = forkTopStartX + forkTopLength;

  return (
    <svg 
      width={size ? `${size / 2}rem` : '100%'}
      height={size ? `${size}rem` : '100%'}
      viewBox="0 0 50 100"
      className="icon--fork"
    >
      <path stroke="transparent" fill="currentColor" d={`
        M 30 90
        Q 25 100 20 90
        L 20 50
        Q 9 37, 10 30
        L 11 0

        L ${forkTopStartX + pinWidth} 0
        L ${forkTopStartX + pinWidth} 28
        Q ${forkTopStartX + (pinWidth * 2) - (pinWidth / 2)} 30 ${forkTopStartX + (pinWidth * 2)} 28

        L ${forkTopStartX + (pinWidth * 2)} 0
        L ${forkTopStartX + (pinWidth * 3)} 0
        L ${forkTopStartX + (pinWidth * 3)} 28 
        Q ${forkTopStartX + (pinWidth * 4) - (pinWidth / 2)} 30 ${forkTopStartX + (pinWidth * 4)} 28 

        L ${forkTopStartX + (pinWidth * 4)} 0
        L ${forkTopStartX + (pinWidth * 5)} 0
        L ${forkTopStartX + (pinWidth * 5)} 28
        Q ${forkTopStartX + (pinWidth * 6) - (pinWidth / 2)} 30 ${forkTopStartX + (pinWidth * 6)} 28
        
        L ${forkTopStartX + (pinWidth * 6)} 0 
        L ${forkTopStartX + (pinWidth * 7)} 0

        L ${forkBodyX + 1} 30
        Q ${forkBodyX + 2} 37, 30 50
        Z
      `} />
    </svg>
  );
}
