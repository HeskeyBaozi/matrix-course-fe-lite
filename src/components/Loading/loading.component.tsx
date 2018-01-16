import React from 'react';
import classNames from 'classnames';
import { Icon, Spin } from 'antd';
import styles from './loading.component.less';


interface LoadingProps {
  isLoading: boolean;
  isFullScreen: boolean;
}

export function Loading({ isLoading, isFullScreen }: LoadingProps) {
  return (
    <div className={ classNames(styles.loading, {
      [styles.hidden]: !isLoading,
      [styles.fullScreen]: isFullScreen
    }) }>
      <Spin spinning={ isLoading } tip={ 'LOADING' } indicator={ <Icon type="loading" className={ styles.icon }/> }/>
    </div>
  );
}
