import Markdown from '@/components/common/Markdown';
import { OneCourseModel } from '@/models/one-course.model';
import { Card, Col, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';

interface IOneCourseHomeProps extends RouteComponentProps<{}> {
  $OneCourse?: OneCourseModel;
}

@inject('$OneCourse')
@observer
export default class OneCourseHome extends React.Component<IOneCourseHomeProps> {
  render() {
    const { $OneCourse } = this.props;
    const { one } = $OneCourse!;
    return (
      <Row gutter={ 16 }>
        <Col sm={ 24 } md={ 24 } lg={ 16 } xl={ 16 }>
          <Card
            loading={ !$OneCourse!.isOneCourseLoaded }
            title={ '课程信息' }
          >
            <Markdown source={ one.description }/>
          </Card>
        </Col>
        <Col sm={ 24 } md={ 24 } lg={ 8 } xl={ 8 }>
          <Row gutter={ 16 }>
            <Col span={ 24 } style={ { marginBottom: '1rem' } }>
              <Card>
                Description
              </Card>
            </Col>
            <Col span={ 24 } style={ { marginBottom: '1rem' } }>
              <Card>
                Description
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
