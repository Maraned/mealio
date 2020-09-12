import React from 'react';
import Icon from 'components/core/icons/Icon';
import { FaExclamationCircle } from 'react-icons/fa';

export default function ErrorIcon(props) {
  return (
    <Icon {...props}>
      <FaExclamationCircle />
    </Icon>
  );
}
