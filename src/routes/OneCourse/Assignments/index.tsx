import DescriptionList from '@/components/common/DescriptionList';
import { OneCourseModel } from '@/models/one-course.model';
import { IAssignmentItem } from '@/types/api';
import { descriptionRender, formatter, getBadgeStatus, IDescriptionItem } from '@/utils/helpers';
import { Badge, Card, Input, List, Progress, Radio } from 'antd';
import { format } from 'date-fns/esm';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';

interface IOnceCourseAssignments extends RouteComponentProps<{}> {
  $OneCourse?: OneCourseModel;
}

@inject('$OneCourse')
@observer
export default class OneCourseAssignments extends React.Component<IOnceCourseAssignments> {

  @observable
  statusFilter: 'in-progress' | 'out-of-date' | 'not-started' = 'in-progress';

  @observable
  submitFilter: 'all' | 'submitted' | 'not-submitted' = 'all';

  @observable
  search = '';

  @observable
  currentPage = 1;

  @computed
  get dataSource() {
    const { $OneCourse } = this.props;
    const statusData = this.statusFilter === 'in-progress' ? $OneCourse!.inProgress : (
      this.statusFilter === 'out-of-date' ? $OneCourse!.outOfDate : (
        this.statusFilter === 'not-started' ? $OneCourse!.notStarted : []
      )
    );

    const submitData = statusData.filter((assignment) => this.submitFilter === 'submitted'
      ? assignment.submit_times : !assignment.submit_times);

    const resultData = this.submitFilter === 'all' ? statusData : submitData;

    return resultData.filter((assignment) => assignment.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1);
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
      <Radio.Button value={ 'not-started' }>
        <div className={ styles.radioContainer }>
          <span>未开始</span>
          <Badge
            className={ styles.count }
            showZero={ true }
            count={ $OneCourse!.notStarted.length }
          />
        </div>
      </Radio.Button>
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
  handleStatusFilterChange = ({ target }: SyntheticEvent<HTMLInputElement>) => {
    this.statusFilter = (target as HTMLInputElement).value as 'in-progress' | 'out-of-date' | 'not-started';
  }

  @action
  handleSearchChange = ({ currentTarget }: SyntheticEvent<HTMLInputElement>) => {
    this.search = currentTarget.value;
  }

  @action
  handleSubmitFilterChange = ({ target }: SyntheticEvent<HTMLInputElement>) => {
    this.submitFilter = (target as HTMLInputElement).value as 'all' | 'submitted' | 'not-submitted';
  }

  render() {
    const { $OneCourse } = this.props;
    const extraContent = (
      <div className={ styles.extraContent }>
        <Radio.Group value={ this.statusFilter } onChange={ this.handleStatusFilterChange }>
          { this.notStartedRadio }
          <Radio.Button value={ 'in-progress' }>
            <div className={ styles.radioContainer }>
              <span>进行中</span>
              <Badge
                className={ styles.count }
                showZero={ true }
                count={ $OneCourse!.inProgress.length }
              />
            </div>
          </Radio.Button>
          <Radio.Button value={ 'out-of-date' }>
            <div className={ styles.radioContainer }>
              <span>已结束</span>
              <Badge
                className={ styles.count }
                showZero={ true }
                count={ $OneCourse!.outOfDate.length }
              />
            </div>
          </Radio.Button>
        </Radio.Group>
        <Radio.Group value={ this.submitFilter } onChange={ this.handleSubmitFilterChange }>
          <Radio.Button value={ 'all' }>全部</Radio.Button>
          <Radio.Button value={ 'not-submitted' }>未提交</Radio.Button>
          <Radio.Button value={ 'submitted' }>已提交</Radio.Button>
        </Radio.Group>
        <Input.Search
          className={ styles.extraContentSearch }
          value={ this.search }
          placeholder={ '按作业题目搜索' }
          onChange={ this.handleSearchChange }
        />
      </div>
    );
    return [
      (
        <Card
          key={ 'filter' }
          style={ { marginBottom: '1rem' } }
          title={ '课程作业' }
          extra={ extraContent }
        />
      ),
      (
        <List
          key={ 'list' }
          grid={ { xl: 2, lg: 1, gutter: 16 } }
          loading={ !$OneCourse!.isAssignmentsLoaded }
          dataSource={ this.displayDataSource }
          renderItem={ renderItem }
          pagination={ this.pagination }
        />
      )
    ];
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
                      course_id,
                      ca_id,
                      last_submission_time
                    }: IAssignmentItem) {

  const percent = (grade || 0) * 100 / standard_score;
  const status = getBadgeStatus(!!last_submission_time, grade, standard_score);
  const progressStatus = last_submission_time && grade !== null ? (percent >= 60 ? 'success' : 'exception') : 'active';

  const descriptions: IDescriptionItem[] = [
    {
      term: '题型',
      key: 'type',
      icon: 'info-circle-o',
      value: type
    },
    {
      term: '截止日期',
      key: 'ddl',
      icon: 'calendar',
      value: format(enddate, 'HH:mm A, Do MMM. YYYY')
    },
    {
      term: '提交次数',
      key: 'submissiont-times',
      icon: 'upload',
      value: `${submit_times} / ${submit_limitation === 0 ? 'No Limits' : submit_limitation}`
    }
  ];

  const content = (
    <DescriptionList
      style={ { marginBottom: '1rem' } }
      title={ null }
      col={ 2 }
    >
      { descriptions.map(descriptionRender) }
    </DescriptionList>
  );

  return (
    <List.Item className={ styles.listItem }>
      <Link to={ `/course/${course_id}/assignment/${ca_id}/` }>
        <Card
          hoverable={ true }
          bodyStyle={ { height: '10rem' } }
          title={ <span className={ styles.assignmentTitle }>{ title }</span> }
          extra={ <Badge className={ styles.badgeStatus } status={ status[ 0 ] } text={ status[ 1 ] }/> }
        >
          <DescriptionList
            title={ null }
            col={ 2 }
            style={ { marginBottom: '1rem' } }
          >
            { content }
          </DescriptionList>
          <Progress
            strokeWidth={ 5 }
            format={ formatter(grade || 0, standard_score) }
            width={ 64 }
            status={ progressStatus }
            percent={ percent }
          />
        </Card>
      </Link>
    </List.Item>
  );
}
