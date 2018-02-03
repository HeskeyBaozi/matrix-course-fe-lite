import { ProgrammingModel } from '@/routes/OneAssignment/Programming/model';
import RanksTable from '@/routes/OneAssignment/Programming/Rank/RanksTable';
import { IRanksItem } from '@/types/api';
import { Card } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { compareAsc, format, formatDistance } from 'date-fns/esm';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingRank {
  $$Programming?: ProgrammingModel;
}

@inject('$$Programming')
@observer
export default class ProgrammingRank extends React.Component<IProgrammingRank> {

  @computed
  get loading() {
    return !this.props.$$Programming!.isRanksLoaded;
  }

  @computed
  get ranks() {
    return this.props.$$Programming!.ranks;
  }

  @computed
  get columns(): Array<ColumnProps<IRanksItem>> {
    return [
      { dataIndex: 'nickname', key: 'nickname', title: '昵称' },
      {
        dataIndex: 'grade', title: '成绩',
        key: 'grade',
        sorter: (a, b) => (a.grade) - (b.grade)
      },
      {
        dataIndex: 'submissionTimes', key: 'times', title: '提交次数',
        sorter: (a, b) => (a.submissionTimes) - (b.submissionTimes)
      },
      {
        dataIndex: 'lastSubmissionTime',
        key: 'last', title: '最后提交时间',
        render: (text) => `${formatDistance(text, Date.now())} ago / ${format(text, 'HH:mm A, Do MMM. YYYY')}`,
        sorter: (a, b) => compareAsc(a.lastSubmissionTime, b.lastSubmissionTime)
      }
    ];
  }

  @computed
  get pagination() {
    return {
      pageSize: 15, showSizeChanger: true,
      size: 'small', pageSizeOptions: [ '15', '30' ],
      showQuickJumper: true
    };
  }

  render() {
    return (
      <RanksTable
        bordered={ true }
        bodyStyle={ { backgroundColor: 'white' } }
        loading={ this.loading }
        rowKey={ 'user_id' }
        dataSource={ this.ranks.slice() }
        columns={ this.columns }
        pagination={ this.pagination }
      />
    );
  }
}
