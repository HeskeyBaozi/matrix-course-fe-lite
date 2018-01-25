import { Card, Icon } from 'antd';
import { CardProps } from 'antd/lib/card';
import React, { ReactNode } from 'react';
import styles from './index.less';

interface IFieldCardProps extends CardProps {
  total: number | ReactNode;
  icon?: string;
  times?: string;
  title: ReactNode;
  avatar?: ReactNode;
  action: ReactNode;
}

export default function FieldCard({ total, icon, title, avatar, action, times, ...rest }: IFieldCardProps) {

  const titleRender = (
    <div>
      <span className={ styles.total }>
        <span>{ total }</span>
        { times && <span className={ styles.times }>{ times }</span> }
      </span>
    </div>
  );

  return (
    <Card { ...rest }>
      <div className={ styles.cardWrapper }>
        { avatar && <div className={ styles.avatar }>{ avatar }</div> }
        <div className={ styles.metaWrapper }>
          <span className={ styles.title }>{ icon && <Icon className={ styles.icon } type={ icon } /> }{ title }</span>
          <Card.Meta title={ titleRender } />
          <span className={ styles.action }>{ action }</span>
        </div>
      </div>
    </Card>
  );
}
