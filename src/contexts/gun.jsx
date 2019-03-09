import Gun from 'gun';
import React, { createContext } from 'react';

var gun = Gun(`${process.env.BACKEND_URL}/gun`);

export const GunContext = createContext(gun);

export const GunProvider = props => (
  <GunContext.Provider value={gun}>
    {props.children}
  </GunContext.Provider>
)
