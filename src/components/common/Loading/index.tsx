import { Icon, Spin } from 'antd';
import classNames from 'classnames';
import React from 'react';
import styles from './index.less';

interface ILoadingProps {
  showTips?: boolean;
  isLoading: boolean;
  isFullScreen: boolean;
  modifyClassName?: string;
}

export default function Loading({ isLoading, isFullScreen, modifyClassName, showTips = true }: ILoadingProps) {

  const wrapperStyles = classNames(styles.loading, modifyClassName, {
    [ styles.hidden ]: !isLoading,
    [ styles.fullScreen ]: isFullScreen
  });

  return (
    <div className={ wrapperStyles }>
      <Spin
        spinning={ isLoading }
        tip={ showTips ? 'LOADING' : void 0 }
        indicator={ <Icon type='loading' className={ styles.icon } /> }
      />
    </div>
  );
}
