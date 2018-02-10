import { Icon, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { GlobalModel } from 'src/models/global.model';
import { OneAssignmentModel } from 'src/models/one-assignment.model';
import { GeneralKey } from 'src/types/constants';
import styles from './index.less';

interface IGeneralAssignmentMenuProps extends RouteComponentProps<{ ca_id: string, course_id: string }> {
  $OneAssignment?: OneAssignmentModel;
  $Global?: GlobalModel;
}

@inject('$Global', '$OneAssignment')
@observer
export default class GeneralAssignmentMenu extends React.Component<IGeneralAssignmentMenuProps> {

  @computed
  get mappedList() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabList.map(({ key, icon, tab }) => (
      <Menu.Item key={ key }>
        { icon ? <Icon type={ icon }/> : null }
        <span>{ tab }</span>
      </Menu.Item>
    ));
  }

  @computed
  get returnItem() {
    return (
      <Menu.Item className={ styles.returnItem } key={ 'RETURN' }>
        <Icon type={ 'rollback' }/>
        <span>{ '返回上一级' }</span>
      </Menu.Item>
    );
  }

  @computed
  get displayList() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.isDetailLoaded ? [ this.returnItem, ...this.mappedList ] : [ this.returnItem ];
  }

  componentWillUnmount() {
    const { $OneAssignment } = this.props;
    $OneAssignment!.needReload();
  }

  navigate = ({ key }: ClickParam) => {
    const { history, match, $OneAssignment } = this.props;
    const { course_id } = match.params;
    if (key === 'RETURN') {
      history.push(`/course/${course_id}/assignments`);
    } else {
      $OneAssignment!.changeTab(key as GeneralKey);
    }
  }

  render() {
    const { $Global, $OneAssignment } = this.props;

    return (
      <Menu
        className={ styles.menu }
        theme={ 'dark' }
        inlineCollapsed={ $Global!.collapsed }
        onClick={ this.navigate }
        mode={ 'inline' }
        selectedKeys={ [ $OneAssignment!.tabActiveKey ] }
      >
        { this.displayList }
      </Menu>
    );
  }
}
