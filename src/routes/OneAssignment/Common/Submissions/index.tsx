import ChartCard from '@/components/common/Charts/ChartCard';
import MiniBar from '@/components/common/Charts/MiniBar';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { ISubmissionItem } from '@/types/api';
import { statusFromGrade } from '@/utils/helpers';
import { Badge, Button, Col, Row } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { compareAsc, format, formatDistance } from 'date-fns/esm';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import SubmissionsTable from './SubmissionsTable.class';

interface ISubmissionsProps {
  $OneAssignment?: OneAssignmentModel;
  getClickHandler: (subCaId: number) => () => void;
}

@inject('$OneAssignment')
@observer
export default class Submissions extends React.Component<ISubmissionsProps> {
  @computed
  get submissions() {
    return this.props.$OneAssignment!.submissions;
  }

  @computed
  get full() {
    return this.props.$OneAssignment!.assignment.config.standard_score;
  }

  @computed
  get miniBarData() {
    return this.submissions
      .slice(0, Math.min(36, this.submissions.length))
      .map(({ submit_at, grade }) => {
        return {
          x: format(submit_at, 'YYYY-MM-DD HH:mma'),
          y: statusFromGrade(grade, [ 0, 0, grade ])
        };
      });
  }

  @computed
  get highestScore() {
    return Math.max(0, ...this.submissions.map(({ grade }) => grade || 0));
  }

  @computed
  get columns(): Array<ColumnProps<ISubmissionItem>> {
    return [
      {
        dataIndex: 'sub_ca_id', key: 'action', title: '操作', render: (subCaId) => (
          <Button
            icon={ 'eye' }
            type={ 'ghost' }
            onClick={ this.props.getClickHandler(subCaId) }
          >详情
          </Button>
        ),
        width: 'min-content'
      },
      { dataIndex: 'sub_ca_id', key: 'sub_ca_id', title: '作业提交ID' },
      {
        dataIndex: 'grade', title: '成绩',
        key: 'grade',
        render: (grade) => statusFromGrade(grade, [ '尚未评分', '正在评分', `${grade} / ${this.full}` ]),
        sorter: (a, b) => (a.grade || 0) - (b.grade || 0)
      },
      {
        key: 'status',
        dataIndex: 'grade', title: '评分状态',
        render: (grade) => {
          const state = statusFromGrade(grade, [
            [ 'default', '尚未评分' ], [ 'processing', '正在评分' ], [ [ 'success', '已评分' ], [ 'error', '已评分 较低分' ] ]
          ], this.full);
          return <Badge status={ state[ 0 ] } text={ state[ 1 ] }/>;
        }
      },
      {
        dataIndex: 'submit_at',
        key: 'submit_at_time', title: '提交时间',
        render: (text) => `${formatDistance(text, Date.now())} ago / ${format(text, 'HH:mm A, Do MMM. YYYY')}`,
        sorter: (a, b) => compareAsc(a.submit_at, b.submit_at),
        defaultSortOrder: 'descend'
      }
    ];
  }

  @computed
  get pagination() {
    return {
      pageSize: 5, showSizeChanger: true,
      size: 'small', pageSizeOptions: [ '5', '10' ],
      showQuickJumper: true
    };
  }

  @computed
  get isSubmissionsLoaded() {
    return this.props.$OneAssignment!.isSubmissionsLoaded;
  }

  render() {
    return [ (
      <Row key={ 'charts' } gutter={ 16 } type={ 'flex' }>
        <Col sm={ 18 } xs={ 24 } style={ { marginBottom: '1rem' } }>
          <ChartCard title={ '最好成绩' } total={ `${this.highestScore} pts` }>
            <MiniBar height={ 48 } data={ this.miniBarData }/>
          </ChartCard>
        </Col>
        <Col sm={ 6 } xs={ 24 } style={ { marginBottom: '1rem' } }>
          <ChartCard style={ { height: '100%' } } title={ '总提交次数' } total={ `${this.submissions.length} 次` }/>
        </Col>
      </Row>
    ), (
      <SubmissionsTable
        key={ 'submission-table' }
        bodyStyle={ { backgroundColor: 'white' } }
        bordered={ true }
        loading={ !this.isSubmissionsLoaded }
        rowKey={ 'sub_ca_id' }
        dataSource={ this.submissions.slice() }
        columns={ this.columns }
        pagination={ this.pagination }
      />
    ) ];
  }
}
