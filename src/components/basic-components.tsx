import React from 'react';
import { Button } from 'antd';
import styles from './basic-components.less'
import { ButtonProps } from 'antd/lib/button';


export function MButton(props: ButtonProps) {
  return (<Button { ...props } className={ styles.MButton }/>)
}
