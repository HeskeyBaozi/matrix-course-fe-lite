import DescriptionList from '@/components/common/DescriptionList';
import Markdown from '@/components/common/Markdown';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { OneCourseModel } from '@/models/one-course.model';
import DiscussionsTable from '@/pages/OneAssignment/Programming/Description/DiscussionsTable';
import { IDiscussionItem, IProgrammingConfig } from '@/types/api';
import { descriptionRender, IDescriptionItem } from '@/utils/helpers';
import { Avatar, Card, Col, Row } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { compareAsc, format, formatDistance } from 'date-fns/esm';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingDescriptionProps {
  $OneAssignment?: OneAssignmentModel;
  $OneCourse?: OneCourseModel;
}

@inject('$OneAssignment', '$OneCourse')
@observer
export default class ProgrammingDescription extends React.Component<IProgrammingDescriptionProps> {

  @computed
  get programmingLimits(): IDescriptionItem[] {
    const { config }: { config: IProgrammingConfig } = this.props.$OneAssignment!.assignment;
    return [
      { term: '时间限制', key: 'time-limits', icon: 'clock-circle-o', value: `${config.limits.time} ms` },
      { term: '内存限制', key: 'space-limits', icon: 'database', value: `${config.limits.memory} MBytes` }
    ];
  }

  @computed
  get discussionsTableLoading() {
    return !this.props.$OneCourse!.isDiscussionsLoaded;
  }

  @computed
  get discussions() {
    const { $OneCourse, $OneAssignment } = this.props;
    return $OneCourse!.discussions
      .filter(({ ca_id }) => ca_id && ca_id === $OneAssignment!.assignment.ca_id);
  }

  @computed
  get columns(): Array<ColumnProps<IDiscussionItem>> {
    return [
      {
        dataIndex: 'username', title: '讨论人',
        key: 'avatar',
        render: (username) => (
          <Avatar size={ 'large' } icon={ 'user' } src={ '/api/users/profile/avatar?username=' + username }/>
        )
      },
      {
        dataIndex: 'title', key: 'title', title: '讨论标题'
      },
      {
        key: 'last', title: '最后回复时间',
        render: (_, { date, lastDate }) => (
          `${formatDistance(lastDate || date, Date.now())} ago / ${format(lastDate || date, 'HH:mm, YYYY-MM-DD')}`
        ),
        sorter: (a, b) => compareAsc(a.lastDate || a.date, b.lastDate || b.date)
      }
    ];
  }

  @computed
  get tableLocale() {
    return {
      emptyText: '暂无相关讨论'
    };
  }

  @computed
  get pagination() {
    return {
      pageSize: 5, showSizeChanger: true,
      size: 'small', pageSizeOptions: [ '5', '10' ],
      showQuickJumper: true
    };
  }

  tableTitle = () => {
    return (
      <span>相关讨论</span>
    );
  }

  render() {
    const { assignment, isDetailLoaded } = this.props.$OneAssignment!;
    return (
      <Row type={ 'flex' } gutter={ 16 }>
        <Col
          xl={ { span: 14, order: 1 } }
          lg={ { span: 16, order: 1 } }
          sm={ { span: 24, order: 2 } }
          xs={ { span: 24, order: 2 } }
        >
          <Card title={ '题目描述' } loading={ !isDetailLoaded }>
            <Markdown source={ assignment.description }/>
          </Card>
        </Col>
        <Col
          xl={ { span: 10, order: 2 } }
          lg={ { span: 8, order: 2 } }
          sm={ { span: 24, order: 1 } }
          xs={ { span: 24, order: 1 } }
          style={ { marginBottom: '1rem' } }
        >
          <Row>
            <Col>
              <Card title={ '题目要求' } loading={ !isDetailLoaded } style={ { marginBottom: '1rem' } }>
                <DescriptionList title={ null } col={ 1 }>
                  { this.programmingLimits.map(descriptionRender) }
                </DescriptionList>
              </Card>
            </Col>
            <Col>
              <DiscussionsTable
                bodyStyle={ { backgroundColor: 'white' } }
                bordered={ true }
                locale={ this.tableLocale }
                loading={ this.discussionsTableLoading }
                rowKey={ 'id' }
                dataSource={ this.discussions.slice() }
                columns={ this.columns }
                pagination={ this.pagination }
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
