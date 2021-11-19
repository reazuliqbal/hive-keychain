import React from 'react';
import './dialog-header.component.scss';

type Props = { title: string };

const DialogHeader = ({ title }: Props) => {
  console.log(title);
  return <h2 className="dialog-header">{title}</h2>;
};

export default DialogHeader;