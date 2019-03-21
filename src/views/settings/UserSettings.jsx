import React, { useState, useContext } from 'react';

import posed, { PoseGroup } from 'react-pose';

import { UserContext } from 'contexts/user';

const UserSettings = () => {
  const { state: user } = useContext(UserContext);
  const [showImageUploader, setShowImageUploader] = useState(false);

  const renderUserAvatar = () => (
    <div className="userSettings__avatar">
      <img src={user.avatarImage} />
    </div>
  )

  return (
    <div className="userSettings">

    </div>
  );
}

export default UserSettings;
