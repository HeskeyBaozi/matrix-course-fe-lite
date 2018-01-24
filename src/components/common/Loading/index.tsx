import React from 'react';
import classNames from 'classnames';
import { Icon, Spin } from 'antd';
import styles from './index.less';


interface LoadingProps {
  showTips?: boolean;
  isLoading: boolean;
  isFullScreen: boolean;
  modifyClassName?: string;
}

export default function Loading({ isLoading, isFullScreen, modifyClassName, showTips = true }: LoadingProps) {
  return (
    <div className={ classNames(styles.loading, modifyClassName, {
      [styles.hidden]: !isLoading,
      [styles.fullScreen]: isFullScreen
    }) }>
      <Spin spinning={ isLoading } tip={ showTips ? 'LOADING' : void 0 }
            indicator={ <Icon type="loading" className={ styles.icon }/> }/>
    </div>
  );
}
