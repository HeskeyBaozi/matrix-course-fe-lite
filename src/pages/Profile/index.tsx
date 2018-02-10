import CurrentCoursesCard from '@/components/CurrentCoursesCard';
import DeadlinesCard from '@/components/DeadlinesCard';
import UserProfileCard from '@/components/UserProfileCard';
import { ProfileModel } from '@/models/profile.model';
import { Col, Row } from 'antd';
import { ColProps } from 'antd/lib/grid';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';

interface IProfileRouteProps extends RouteComponentProps<{}> {
  $Profile?: ProfileModel;
}

const topRightResponsive: ColProps = { xs: 24, sm: 24, md: 12, lg: 12, xl: 6, style: { marginBottom: '1rem' } };

@inject('$Profile')
@observer
export default class ProfileRoute extends React.Component<IProfileRouteProps> {
  render() {
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
