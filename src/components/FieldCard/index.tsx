import React, { ReactNode } from 'react';
import { Card, Icon } from 'antd';
import styles from './index.less';
import { CardProps } from 'antd/lib/card';

interface FieldCardProps extends CardProps {
  total: number | ReactNode;
  icon?: string;
  title: ReactNode;
  avatar?: ReactNode;
  action: ReactNode;
}

export default function FieldCard({ total, icon, title, avatar, action, ...rest }: FieldCardProps) {
  return (
    <Card {...rest}>
      <div className={ styles.cardWrapper }>
        {
          avatar && <div className={ styles.avatar }>
            { avatar }
          </div>
        }
        <div className={ styles.metaWrapper }>
          <span className={ styles.title }>{ icon && <Icon className={ styles.icon } type={ icon } /> }{ title }</span>
          <Card.Meta title={ <span className={ styles.total }>{ total }</span> } />
          <span className={ styles.action }>{ action }</span>
        </div>
      </div>
    </Card>
  );
};
