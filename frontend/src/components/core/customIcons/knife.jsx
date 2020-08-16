import React from 'react';

export default function Knife({ size }) {
  const pinWidth = 4;
  const forkTopStartX = 36;
  const forkTopLength = pinWidth * 7;
  const forkBodyX = forkTopStartX + forkTopLength;

  return (
    <svg 
      width={size ? `${size / 2}rem` : '100%'}
      height={size ? `${size}rem` : '100%'}
      viewBox="0 0 50 100"
      className="icon--knife"
    >
      <path stroke="transparent" fill="currentColor" d={`
        M 30 90
        Q 25 100 20 90
        L 23 50
        Q 7 30 25 1
        Q 30 1 30 5
        Z
      `} />
    </svg>
  );
}