import DescriptionList from '@/components/common/DescriptionList';
import Loading from '@/components/common/Loading';
import PageHeader from '@/components/common/PageHeader';
import { ItabItem } from '@/types/common';
import { breadcrumbNameMap } from '@/types/constants';
import { descriptionRender, IDescriptionItem } from '@/utils/helpers';
import { Avatar, Badge } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';

interface IPageWithHeaderProps extends RouteComponentProps<{}> {
  loading: boolean;
  avatarIcon?: string;
  avatarUrl?: string;
  badgeStatus?: 'success' | 'processing' | 'default' | 'error' | 'warning';
  badgeText?: string;
  children: ReactNode;
  col?: number;
  title: string;
  descriptionsList?: IDescriptionItem[];
  tabList?: ItabItem[];
  tabActiveKey?: string;
  onTabChange?: (key: string) => void;
}

@observer
class PageWithHeader extends React.Component<IPageWithHeaderProps> {
  @computed
  get breadcrumb() {
    const { location } = this.props;
    return { breadcrumbNameMap, location };
  }

  @computed
  get pageTitle() {
    const { title, loading, badgeStatus, badgeText } = this.props;
    return (
      <div className={ styles.titleWrapper }>
        <Loading isLoading={ loading } isFullScreen={ false }/>
        <span>{ title }</span>
        { badgeStatus ? <Badge className={ styles.badgeStatus } status={ badgeStatus } text={ badgeText }/> : null }
      </div>
    );
  }

  @computed
  get content() {
    const { descriptionsList, col } = this.props;
    return descriptionsList ? (
      <DescriptionList style={ { marginBottom: '1.5rem' } } title={ null } col={ col || 3 }>
        { descriptionsList.map(descriptionRender) }
      </DescriptionList>
    ) : null;
  }

  @computed
  get logo() {
    const { avatarIcon, avatarUrl } = this.props;
    return (
      avatarIcon ? <Avatar icon={ avatarIcon } src={ avatarUrl }/> : void 0
    );
  }

  render() {
    const { tabList, tabActiveKey, onTabChange, children } = this.props;
    return (
      <div style={ { margin: '-1.5rem' } }>
        <PageHeader
          linkElement={ Link }
          style={ { position: 'relative' } }
          logo={ this.logo }
          title={ this.pageTitle }
          tabList={ tabList }
          tabActiveKey={ tabActiveKey }
          onTabChange={ onTabChange }
          content={ this.content }
          { ...this.breadcrumb }
        />
        <div style={ { padding: '1.5rem' } }>
          { children }
        </div>
      </div>
    );
  }
}

export default withRouter(PageWithHeader);
