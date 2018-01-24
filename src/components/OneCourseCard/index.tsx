import React from 'react';
import { observable, computed } from 'mobx';
import { Card, Row, Col, Icon, Avatar, Badge } from 'antd';
import { CoursesItem, RoleMap, CourseStatusMap } from '@/api/interface';
import styles from './index.less';
import DescriptionList from '@/components/common/DescriptionList';
import Info from '@/components/common/Info';
import { observer } from 'mobx-react';
import { asyncAction } from 'mobx-utils';
import { fetchAvatar } from '@/api/user';

interface OneCourseCardProps {
  item: CoursesItem
}

const { Description } = DescriptionList;


@observer
export default class OneCourseCard extends React.Component<OneCourseCardProps> {
  @observable
  avatarUrl = '';

  @computed
  get displayAvatarUrl() {
    return this.avatarUrl.length ? this.avatarUrl : void 0;
  }

  @asyncAction
  * LoadAvatar() {
    const { username } = this.props.item.creator;
    const { data }: { data: Blob } = yield fetchAvatar(username);
    this.avatarUrl = URL.createObjectURL(data);
  }

  componentDidMount() {
    this.LoadAvatar();
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.avatarUrl);
  }

  render() {
    const {
      item: { course_name, teacher, school_year, term, student_num, progressing_num, role, creator, status }
    } = this.props;
    const title = (
      <div className={ styles.titleWrapper }>
        <div className={ styles.left }>
          <Avatar icon={ 'user' } src={ this.displayAvatarUrl }/>
          <span>{ `${creator.realname} / ${course_name}` }</span>
        </div>
        <div className={ styles.right }>
          <Badge status={ status === 'open' ? 'success' : 'error' } text={ CourseStatusMap[status] }/>
        </div>
      </div>
    );

    return (
      <Card hoverable title={ title }>
        <DescriptionList style={ { marginBottom: '1.5rem' } } layout={ 'vertical' } title={ null } col={ 2 }>
          <Description term={ <span><Icon type={ 'contacts' }/> 教师</span> }>
            { teacher }
          </Description>
          <Description term={ <span><Icon type={ 'calendar' }/> 学期</span> }>
            { `${school_year} ${term}` }
          </Description>
        </DescriptionList>
        <Row>
          <Col sm={ 8 } xs={ 24 }>
            <Info title={ '学生人数' } value={ `${student_num}人` } bordered/>
          </Col>
          <Col sm={ 8 } xs={ 24 }>
            <Info title={ '进行中作业' } value={ `${progressing_num}个` } bordered/>
          </Col>
          <Col sm={ 8 } xs={ 24 }>
            <Info title={ '我的角色' } value={ RoleMap[role] }/>
          </Col>
        </Row>
      </Card>
    );
  }
}
