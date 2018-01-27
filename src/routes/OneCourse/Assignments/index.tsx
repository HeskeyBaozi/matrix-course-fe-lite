import { IAssignmentItem } from '@/api/interface';
import DescriptionList from '@/components/common/DescriptionList';
import { OneCourseModel } from '@/models/one-course.model';
import { Badge, Card, Col, Icon, Input, List, Progress, Radio, Row } from 'antd';
import { format } from 'date-fns/esm';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';

const { Description } = DescriptionList;

interface IOnceCourseAssignments extends RouteComponentProps<{}> {
  $OneCourse?: OneCourseModel;
}

@inject('$OneCourse')
@observer
export default class OneCourseAssignments extends React.Component<IOnceCourseAssignments> {

  @observable
  status: 'in-progress' | 'out-of-date' | 'not-started' = 'in-progress';

  @observable
  search = '';

  @observable
  currentPage = 1;

  @computed
  get dataSource() {
    const { $OneCourse } = this.props;
    const statusData = this.status === 'in-progress' ? $OneCourse!.inProgress : (
      this.status === 'out-of-date' ? $OneCourse!.outOfDate : (
        this.status === 'not-started' ? $OneCourse!.notStarted : []
      )
    );
    return statusData.filter((assignment) => assignment.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1);
  }

  @computed
  get displayDataSource() {
    const { pageSize, total } = this.pagination;
    const offset = (this.currentPage - 1) * pageSize;
    return this.dataSource.slice(offset,
      offset + pageSize >= total ? total : offset + pageSize);
  }

  @computed
  get notStartedRadio() {
    const { $OneCourse } = this.props;
    const { one } = $OneCourse!;
    return [ 'TA', 'teacher' ].some((role) => role === one.role) ? (
      <Radio.Button value={ 'not-started' }>未开始</Radio.Button>
    ) : null;
  }

  @computed
  get pagination() {
    return {
      showQuickJumper: true,
      current: this.currentPage,
      pageSize: 12,
      size: 'small',
      total: this.dataSource.length,
      onChange: this.handlePaginationChange
    };
  }

  @action
  handlePaginationChange = (next: number) => {
    this.currentPage = next;
  }

  @action
  handleAssignmentsChange = ({ target }: SyntheticEvent<HTMLInputElement>) => {
    this.status = (target as HTMLInputElement).value as 'in-progress' | 'out-of-date' | 'not-started';
  }

  @action
  handleSearchChange = ({ currentTarget }: SyntheticEvent<HTMLInputElement>) => {
    this.search = currentTarget.value;
  }

  render() {
    const { $OneCourse } = this.props;
    const extraContent = (
      <div className={ styles.extraContent }>
        <Radio.Group value={ this.status } onChange={ this.handleAssignmentsChange }>
          { this.notStartedRadio }
          <Radio.Button value={ 'in-progress' }>进行中</Radio.Button>
          <Radio.Button value={ 'out-of-date' }>已结束</Radio.Button>
        </Radio.Group>
        <Input.Search
          className={ styles.extraContentSearch }
          value={ this.search }
          placeholder={ '请输入' }
          onChange={ this.handleSearchChange }
        />
      </div>
    );
    return (
      <Row gutter={ 16 }>
        <Col span={ 24 } style={ { marginBottom: '1rem' } }>
          <Card title={ '课程作业' } extra={ extraContent } loading={ !$OneCourse!.isAssignmentsLoaded }/>
        </Col>
        <Col span={ 24 }>
          <List
            grid={ { xl: 2, lg: 1, gutter: 16 } }
            dataSource={ this.displayDataSource }
            pagination={ this.pagination }
            renderItem={ renderItem }
            itemLayout={ 'vertical' }
            split={ false }
            bordered={ false }
          />
        </Col>
      </Row>
    );
  }
}

function renderItem({
                      title,
                      type,
                      submit_times,
                      submit_limitation,
                      enddate,
                      grade,
                      standard_score,
                      last_submission_time
                    }: IAssignmentItem) {
  const status: [ 'success' | 'processing' | 'default' | 'error' | 'warning', string ] = last_submission_time ? (
    grade !== null ? (grade === 0 ? [ 'error', '已批改 0分?' ] : [ 'success', '已批改' ]) : [ 'processing', '已提交' ]
  ) : [ 'default', '未提交' ];

  const titleWrap = [
    <span key={ 'title' } className={ styles.assignmentTitle }>{ title }</span>,
    <Badge key={ 'state' } className={ styles.badgeStatus } status={ status[ 0 ] } text={ status[ 1 ] }/>
  ];

  const description = (
    <DescriptionList
      key={ 'basic' }
      title={ null }
      col={ 2 }
      style={ { marginBottom: '1rem' } }
    >
      <Description term={ <span><Icon type={ 'contacts' }/> 题型</span> }>
        { type }
      </Description>
      <Description term={ <span><Icon type={ 'calendar' }/> 截止日期</span> }>
        { format(enddate, 'HH:mm A, Do MMM. YYYY') }
      </Description>
      <Description term={ <span><Icon type={ 'calendar' }/> 提交次数</span> }>
        { `${submit_times} / ${submit_limitation === 0 ? 'No Limits' : submit_limitation}` }
      </Description>
    </DescriptionList>
  );

  const percent = (grade || 0) * 100 / standard_score;
  const progressStatus = last_submission_time && grade !== null ? (percent >= 60 ? 'success' : 'exception') : 'active';

  return (
    <List.Item>
      <Card
        hoverable={ true }
        title={ titleWrap }
      >
        { description }
        <Progress
          strokeWidth={ 5 }
          format={ progressFormat }
          width={ 64 }
          status={ progressStatus }
          percent={ percent }
        />
      </Card>
    </List.Item>
  );
}

function progressFormat(percent: number) {
  return percent >= 100 ? 'full marks' : `${percent}%`;
}
