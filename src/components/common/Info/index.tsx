import React from 'react';
import styles from './index.less';

interface InfoProps {
  title: string;
  value: string;
  bordered?: boolean;
}

export default function Info({ title, value, bordered }: InfoProps) {
  return (
    <div className={styles.infoWrapper}>
      <span>{title}</span>
      <p className={styles.infoValue}>{value}</p>
      {bordered && <em/>}
    </div>
  );
}
