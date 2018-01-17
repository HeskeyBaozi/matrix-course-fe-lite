import React, { ReactNode } from 'react';
import { Icon } from 'antd';


interface ILink {
  key: string;
  title: ReactNode;
  href: string;
  blankTarget?: boolean;
}

const links: ILink[] = [
  {
    key: 'about-us',
    title: '关于我们',
    href: 'https://about.vmatrix.org.cn/',
    blankTarget: true
  },
  {
    key: 'blog',
    title: '技术博客',
    href: 'https://blog.vmatrix.org.cn/',
    blankTarget: true
  }
];

const copyright = <div>Copyright <Icon type={ 'copyright' }/> VMatrix 第三方微系统</div>;

export default class Footer extends React.PureComponent {

}
