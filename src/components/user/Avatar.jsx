import React, { useContext } from 'react';
import { FaUser } from 'react-icons/fa';

import './avatar.css';
import { UserContext } from 'contexts/user';

const Avatar = ({ onClick }) => {
  const { state } = useContext(UserContext);
  const avatar = state.userProfile.avatar;
  
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
