import { IDiscussionItem } from '@/api/interface';
import DescriptionList from '@/components/common/DescriptionList';
import { OneCourseModel } from '@/models/one-course.model';
import { descriptionRender, IDescriptionItem } from '@/utils/helpers';
import { Avatar, Card, Icon, Input, List, Radio } from 'antd';
import { compareAsc, format } from 'date-fns/esm';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';

enum Sorter {
  Latest, Hottest, Newest
}

interface IOnceCourseDiscussions extends RouteComponentProps<{}> {
  $OneCourse?: OneCourseModel;
}

@inject('$OneCourse')
@observer
export default class OneCourseDiscussions extends React.Component<IOnceCourseDiscussions> {
  @observable
  sorter: Sorter = Sorter.Latest;

  @observable
  search = '';

  @observable
  currentPage = 1;

  @action
  handleSorterChange = ({ target }: SyntheticEvent<HTMLInputElement>) => {
    this.sorter = (target as HTMLInputElement).value as any;
  }

  @action
  handleSearchChange = ({ currentTarget }: SyntheticEvent<HTMLInputElement>) => {
    this.search = currentTarget.value;
  }

  @action
  handlePaginationChange = (next: number) => {
    this.currentPage = next;
  }

  @computed
  get dataSource() {
    const { $OneCourse } = this.props;
    const discussions = $OneCourse!.discussions;
    switch (this.sorter) {
      case Sorter.Latest:
        return discussions.sort((a, b) => compareAsc(b.lastDate || b.date, a.lastDate || a.date));
      case Sorter.Newest:
        return discussions.sort(({ date: a }, { date: b }) => compareAsc(b, a));
      case Sorter.Hottest:
        return discussions.sort((a, b) => {
          return ((b.answers || 0) + (b.vote_great || 0) - (b.vote_bad || 0))
            - ((a.answers || 0) + (a.vote_great || 0) - (a.vote_bad || 0));
        });
      default:
        return discussions;
    }
  }

  @computed
  get displayDataSource() {
    const { pageSize, total } = this.pagination;
    const offset = (this.currentPage - 1) * pageSize;
    return this.dataSource.slice(offset,
      offset + pageSize >= total ? total : offset + pageSize);
  }

  @computed
  get pagination() {
    return {
      showQuickJumper: true,
      current: this.currentPage,
      pageSize: 8,
      size: 'small',
      total: this.dataSource.length,
      onChange: this.handlePaginationChange
    };
  }

  render() {
    const { $OneCourse } = this.props;

    const extraContent = (
      <div className={ styles.extraContent }>
        <Radio.Group value={ this.sorter } onChange={ this.handleSorterChange }>
          <Radio.Button value={ Sorter.Latest }>按最近讨论</Radio.Button>
          <Radio.Button value={ Sorter.Hottest }>按热度</Radio.Button>
          <Radio.Button value={ Sorter.Newest }>按最新发表</Radio.Button>
        </Radio.Group>
        <Input.Search
          className={ styles.extraContentSearch }
          value={ this.search }
          placeholder={ '按标题搜索' }
          onChange={ this.handleSearchChange }
        />
      </div>
    );

    return [
      (
        <Card
          key={ 'filter' }
          style={ { marginBottom: '1rem' } }
          title={ '课程讨论' }
          extra={ extraContent }
        />
      ),
      (
        <List
          key={ 'list' }
          grid={ { xl: 2, lg: 1, gutter: 16 } }
          loading={ !$OneCourse!.isDiscussionsLoaded }
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
                      answers,
                      vote_great,
                      vote_bad,
                      username,
                      date,
                      lastDate,
                      ca_id,
                      prob_title
                    }: IDiscussionItem) {

  const actions = [
    <span key={ 'likes' }><Icon type={ 'like-o' }/> { (vote_great || 0) - (vote_bad || 0) }</span>,
    <span key={ 'answers' }><Icon type={ 'message' }/> { answers || 0 }</span>
  ];

  const descriptions: IDescriptionItem[] = [
    {
      term: '最近讨论于',
      key: 'post',
      icon: 'calendar',
      value: format(lastDate || date, 'HH:mm A, Do MMMM YYYY')
    }
  ];

  if (ca_id) {
    descriptions.push({
      term: '相关题目',
      key: 'related-problem',
      icon: 'link',
      value: <Link to={ '#' }>{ prob_title }</Link>
    });
  }

  const cardTitle = (
    <div className={ styles.cardTitle }>
      <Avatar
        icon={ 'user' }
        src={ `/api/users/profile/avatar?username=${username}` }
      />
      <span>{ title }</span>
    </div>
  );

  return (
    <List.Item className={ styles.listItem }>
      <Card actions={ actions } title={ cardTitle } bodyStyle={ { height: '11rem' } }>
        <DescriptionList title={ null } col={ 2 } layout={ 'vertical' }>
          { descriptions.map(descriptionRender) }
        </DescriptionList>
      </Card>
    </List.Item>
  );
}
