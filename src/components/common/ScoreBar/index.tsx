import { Progress } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

interface IScoreBar {
  strokeWidth: number;
  grade: number | null;
  full: number;
  isSubmitted: boolean;
  hiddenText?: boolean;
}

@observer
export default class ScoreBar extends React.Component<IScoreBar> {

  @computed
  get format() {
    const { grade, full, hiddenText } = this.props;
    return formatter(grade || 0, full);
  }

  @computed
  get status() {
    const { isSubmitted, grade } = this.props;
    return isSubmitted && grade !== null ? (this.percent >= 60 ? 'success' : 'exception') : 'active';
  }

  @computed
  get percent() {
    const { grade, full } = this.props;
    return (grade || 0) * 100 / full;
  }

  render() {
    return (
      <Progress
        strokeWidth={ this.props.strokeWidth }
        format={ this.format }
        status={ this.status }
        showInfo={ !this.props.hiddenText }
        percent={ this.percent }
      />
    );
  }
}

function formatter(grade: number, standardScore: number) {
  return function progressFormat(percent: number) {
    return `${grade}pts`;
  };
}
