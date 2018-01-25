import { ICoursesItem } from '@/api/interface';
import OneCourseCard from '@/components/OneCourseCard';
import { CoursesModel } from '@/models/courses.model';
import { Card, Icon, Input, List } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';

const { Item } = List;

interface ICoursesListProps extends RouteComponentProps<{ status: string }> {
  $Courses?: CoursesModel;
}

@inject('$Courses')
@observer
export default class CoursesList extends React.Component<ICoursesListProps> {

  @observable
  titleFilter = '';

  @computed
  get dataSource() {
    const { match, $Courses } = this.props;
    return match.params.status === 'open' ? $Courses!.openList : $Courses!.closeList;
  }

  @computed
  get filteredDataSource() {
    return this.dataSource.filter((item) => item.course_name.indexOf(this.titleFilter) !== -1);
  }

  @action
  observeFilterChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.titleFilter = e.currentTarget.value;
  }

  render() {
    const { $Courses } = this.props;
    const pagination = false; // todo: pagination
    return [ (
      <Card className={ styles.searchArea } key={ 'filter' }>
        <Input
          className={ styles.searchBar }
          value={ this.titleFilter }
          placeholder={ '按课程名称搜索' }
          prefix={ <Icon type={ 'search' } /> }
          onChange={ this.observeFilterChange }
        />
      </Card>), (
      <List
        key={ 'list' }
        loading={ !$Courses!.isCoursesLoaded }
        pagination={ pagination }
        grid={ { gutter: 24, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 } }
        dataSource={ this.filteredDataSource }
        renderItem={ renderItem }
      />
    ) ];
  }
}

function renderItem(item: ICoursesItem) {
  return (
    <Item>
      <Link to={ `/course/${item.course_id}/` }>
        <OneCourseCard item={ item } />
      </Link>
    </Item>
  );
}
