import { ProfileModel } from '@/models/profile.model';
import { Avatar, Card, Icon, List } from 'antd';
import { CardProps } from 'antd/lib/card';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './index.less';

interface IUserProfileComponentProps extends CardProps {
  $Profile?: ProfileModel;
}

@inject('$Profile')
@observer
export default class UserProfile extends React.Component<IUserProfileComponentProps> {
  render() {
    const { $Profile } = this.props;
    const { profile } = $Profile!;

    const Cover = (
      <div
        className={ styles.coverAvatarWrapper }
        style={ { backgroundImage: `url(${$Profile!.avatarUrl})` } }
      >
        <Avatar className={ styles.coverAvatar } icon={ 'user' } src={ $Profile!.avatarUrl } />
      </div>
    );

    const listData = [
      {
        icon: 'mail',
        value: profile.email
      },
      {
        icon: 'link',
        value: profile.homepage
      }
    ].filter((_) => _.value);

    const title = [
      <span key={ 'realname' } className={ styles.realname }>{ profile.realname }</span>,
      <p key={ 'nickname' } className={ styles.nickname }>{ profile.nickname }</p>
    ];

    return (
      <Card
        className={ styles.profileCard }
        loading={ !$Profile!.isProfileLoaded }
        cover={ Cover }
      >
        <Card.Meta title={ title } />
        <List
          loading={ !$Profile!.isProfileLoaded }
          size={ 'small' }
          split={ false }
          dataSource={ listData }
          renderItem={ renderListItem }
        />
      </Card>
    );
  }
}

function renderListItem({ icon, value }: { icon: string, value: string }) {
  const href = `${icon === 'mail' ? 'mailto:' : ''}${value}`;
  const title = [
    <Icon className={ styles.infoIcon } key={ 'icon' } type={ icon } />,
    <a target={ '_blank' } key={ 'value' } href={ href }>{ value }</a>
  ];
  return (
    <List.Item>
      <List.Item.Meta title={ title } />
    </List.Item>
  );
}
