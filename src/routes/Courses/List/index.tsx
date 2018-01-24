import React, { SyntheticEvent } from 'react';
import { computed, observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';
import { List, Card, Input, Icon } from 'antd';
import { CoursesModel } from '@/models/courses.model';
import { CoursesItem } from '@/api/interface';
import OneCourseCard from '@/components/OneCourseCard';

const { Item } = List;

interface CoursesListProps extends RouteComponentProps<{ status: string }> {
  $Courses?: CoursesModel
}

@inject('$Courses')
@observer
export default class CoursesList extends React.Component<CoursesListProps> {

  @observable
  titleFilter = '';

  @computed
  get dataSource() {
    const { match, $Courses } = this.props;
    return match.params.status === 'open' ? $Courses!.openList : $Courses!.closeList;
  }

  @computed
  get filteredDataSource() {
    return this.dataSource.filter(item => item.course_name.indexOf(this.titleFilter) !== -1);
  }

  @action
  observeFilterChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.titleFilter = e.currentTarget.value;;
  }

  render() {
    const { location, match, $Courses } = this.props;
    const pagination = false; // todo: pagination
    return [
      <Card className={ styles.searchArea } key={ 'filter' }>
        <Input className={ styles.searchBar }
          value={ this.titleFilter }
          placeholder={ '按课程名称搜索' }
          prefix={ <Icon type={ 'search' } /> }
          onChange={ this.observeFilterChange } />
      </Card>,
      <List key={ 'list' } pagination={ pagination } grid={ { gutter: 24, lg: 3, md: 1, sm: 1, xs: 1 } } dataSource={ this.filteredDataSource } renderItem={ renderItem } />
    ];
  }
}

function renderItem(item: CoursesItem) {
  return (
    <Item>
      <OneCourseCard item={ item } />
    </Item>
  );
}
