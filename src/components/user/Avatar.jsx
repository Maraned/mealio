import React, { useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { isEmpty } from 'lodash';

import './avatar.css';
import { UserContext } from 'contexts/user';

const url = 'http://localhost:3001/';

const Avatar = ({ onClick }) => {
  const { state: user } = useContext(UserContext);
  console.log('avatar user', user)
  const avatar = user && !isEmpty(user.avatar);
  
  return (
    <div className="avatar" onClick={onClick}>
      {avatar ? (
        <img src={url + avatar} className="avatar__image" />
      ) : (
        <FaUser className="avatar__image avatar__image--default" />
      )}
    </div>
  )
} 

export default Avatar;
