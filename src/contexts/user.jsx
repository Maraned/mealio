import React, { createContext } from 'react';
import UserModel from 'models/userModel';

const initialUserModel = { ...UserModel };

export const UserContext = createContext(initialUserModel);

export const UserProvider = props => (
  <UserContext.Provider value={initialUserModel}>
    {props.children}
  </UserContext.Provider>
)
