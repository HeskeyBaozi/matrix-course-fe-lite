import React from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import { Card, List, Icon } from 'antd';
import { CardProps } from 'antd/lib/card';
import { ProfileModel } from '@/models/profile.model';
import styles from './index.less';

interface UserProfileComponentProps extends CardProps {
  $Profile?: ProfileModel;
}

@inject('$Profile')
@observer
export default class UserProfile extends React.Component<UserProfileComponentProps> {
  render() {
    const { $Profile } = this.props;
    const { profile } = $Profile!;

    const Cover = (
      <div className={ styles.coverAvatarWrapper }
           style={ { backgroundImage: `url(${$Profile!.avatarUrl})` } }>
        <img className={ styles.coverAvatar } src={ $Profile!.avatarUrl } alt={ 'avatar' }/>
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
    ].filter(_ => _.value);

    return (
      <Card className={ styles.profileCard } loading={ !$Profile!.isProfileLoaded }
            cover={ Cover }>
        <Card.Meta title={ [
          <span key={ 'realname' } className={ styles.realname }>{ profile.realname }</span>,
          <p key={ 'nickname' } className={ styles.nickname }>{ profile.nickname }</p>
        ] }/>
        <List loading={ !$Profile!.isProfileLoaded }
              size={ 'small' } split={ false }
              dataSource={ listData }
              renderItem={ renderListItem }/>
      </Card>
    );
  }
}

function renderListItem({ icon, value }: { icon: string, value: string }) {
  const href = `${icon === 'mail' ? 'mailto:' : ''}${value}`;
  return (
    <List.Item>
      <List.Item.Meta
        title={ [
          <Icon className={ styles.infoIcon } key={ 'icon' } type={ icon }/>,
          <a target={ '_blank' } key={ 'value' } href={ href }>{ value }</a>
        ] }
      />
    </List.Item>
  );
}
