import React, { useContext } from 'react';
import { FaUser } from 'react-icons/fa';

import './avatar.css';
import { UserContext } from 'contexts/user';

const Avatar = ({ onClick }) => {
  const user = useContext(UserContext);
  const { avatar } = user;

  
  return (
    <div className="avatar" onClick={onClick}>
    {avatar ? (
      <img src={avatar} className="avatar__image" />
    ) : (
      <FaUser className="avatar__image" />
    )}
    </div>
  )
} 

export default Avatar;
