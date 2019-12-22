import React, { useState, useContext, useEffect } from 'react';

import posed, { PoseGroup } from 'react-pose';

import { UserContext } from 'contexts/user';
import { EditableContext } from 'contexts/editable';
import ImageUpload from 'components/core/imageUpload/ImageUpload'
import EditableField from 'components/core/EditableField';
import Avatar from 'components/user/Avatar';
import ModalButtons from 'components/modal/ModalButtons';
import { ModalContent } from 'components/modal/Modal';

import './userSettings.css';
import { useTranslation } from 'react-i18next';
import { postRequest } from 'utils/request';

const ImageUploadPosed = posed.div({
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0
  }
})

const UserSettings = () => {
  const { state: user, dispatch: userDispatch } = useContext(UserContext);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const { dispatch } = useContext(EditableContext);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch({ type: 'edit' })
  }, []);


  const saveUserSettings = async () => {
    const newUserData = { 
      ...user, 
      avatar,
      displayName 
    };

    const response = await postRequest('users/update', {
      user: newUserData
    }, false);

    userDispatch({ type: 'user', value: newUserData });
  };

  const selectAvatar = files => {
    const image = files[0];

    let reader = new FileReader();
    reader.addEventListener('load', () => {
      const source = reader.result;
      setAvatar(source);
    });
    reader.readAsDataURL(image);
  };

  const renderUserAvatar = () => (
    <div 
      className="userSettings__avatar"
      onMouseOver={() => setShowImageUploader(true)}
      onMouseLeave={() => setShowImageUploader(false)}
    >
      <Avatar />

      <ImageUploadPosed initialPose='hide' pose={showImageUploader ? 'show' : 'hide'}>
        <ImageUpload 
          onDrop={selectAvatar} 
          className="userSettings__imageUploader" 
          circle 
          id="userSettings"
        />
      </ImageUploadPosed>
    </div>
  );

  const renderUserName = () => (
    <EditableField 
      value={displayName}
      onChange={event => setDisplayName(event.target.value)}  
      placeholder={t('UserSettings:DisplayName')}
      center
    />
  );

  const saveDisabled = user.displayName === displayName;

  return (
    <>
      <ModalContent className="userSettings">
        {renderUserAvatar()}
        {renderUserName()}

      </ModalContent>
      <ModalButtons onSave={saveUserSettings} saveDisabled={saveDisabled} />
    </>
  );
}

export default UserSettings;
