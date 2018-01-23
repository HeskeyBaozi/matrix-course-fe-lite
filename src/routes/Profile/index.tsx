import React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { Col, Row } from 'antd';
import { ProfileModel } from '@/models/profile.model';
import UserProfileCard from '@/components/UserProfileCard';
import CurrentCoursesCard from '@/components/CurrentCoursesCard';
import DeadlinesCard from '@/components/DeadlinesCard';
import { ColProps } from 'antd/lib/grid';

interface ProfileRouteProps extends RouteComponentProps<{}> {
  $Profile?: ProfileModel;
}

const topRightResponsive: ColProps = { xs: 24, sm: 24, md: 12, lg: 12, xl: 6, style: { marginBottom: '1rem' } };

@inject('$Profile')
@observer
export default class ProfileRoute extends React.Component<ProfileRouteProps> {
  render() {
    const { $Profile } = this.props;
    return (
      <Row gutter={ 16 }>
        <Col { ...topRightResponsive } xl={ 12 }>
          <UserProfileCard/>
        </Col>
        <Col { ...topRightResponsive }>
          <CurrentCoursesCard/>
        </Col>
        <Col { ...topRightResponsive }>
          <DeadlinesCard/>
        </Col>
      </Row>
    );
  }
}
