import Markdown from '@/components/common/Markdown';
import { OneCourseModel } from '@/models/one-course.model';
import { Card, Col, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';

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
        <Col span={ 16 }>
          <Card loading={ !$OneCourse!.isOneCourseLoaded }>
            <Markdown source={ one.description }/>
          </Card>
        </Col>
        <Col span={ 8 }>
          <Row gutter={ 16 }>
            <Col span={ 12 }>
              <Card>
                Description
              </Card>
            </Col>
            <Col span={ 12 }>
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
