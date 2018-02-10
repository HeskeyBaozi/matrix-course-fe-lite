import MutableCodeEditor, { ICodeEditorDataSource } from '@/components/common/MutableCodeEditor';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { ProgrammingModel } from '@/pages/OneAssignment/Programming/model';
import { AssignmentTimeStatus } from '@/types/constants';
import { Card, Icon } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingStandardAnswerProps {
  $OneAssignment?: OneAssignmentModel;
  $$Programming?: ProgrammingModel;
}

@inject('$OneAssignment', '$$Programming')
@observer
export default class ProgrammingStandardAnswer extends React.Component<IProgrammingStandardAnswerProps> {

  @computed
  get standardAnswerFiles() {
    const { $$Programming } = this.props;
    const start: ICodeEditorDataSource = new Map();
    return ($$Programming!.standardAnswer || [])
      .reduce((acc, file) => {
        acc.set(file.name, {
          readOnly: true,
          value: file.code
        });
        return acc;
      }, start);
  }

  @computed
  get Extra() {
    return (
      <span
        style={ { display: 'flex', alignItems: 'center' } }
      ><Icon type={ 'eye-o' }/><span style={ { margin: '0 .5rem 0 .3rem' } }>参考标准答案</span>
      </span>
    );
  }

  render() {
    const { $$Programming, $OneAssignment } = this.props;
    return $OneAssignment!.timeStatus === AssignmentTimeStatus.OutOfDate ? (
      <Card loading={ !$$Programming!.isStandardAnswerLoaded }>
        <MutableCodeEditor
          mutableDataSource={ this.standardAnswerFiles }
          extraDataSource={ null }
          extra={ this.Extra }
        />
      </Card>
    ) : (
      <Card>
        题目未结束，无法查看参考标准答案
      </Card>
    );
  }
}
