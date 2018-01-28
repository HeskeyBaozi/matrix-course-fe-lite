import DescriptionList from '@/components/common/DescriptionList';
import Loading from '@/components/common/Loading';
import PageHeader from '@/components/common/PageHeader';
import { ItabItem } from '@/types/common';
import { breadcrumbNameMap } from '@/types/constants';
import { descriptionRender, IDescriptionItem } from '@/utils/helpers';
import { Avatar, Badge } from 'antd';
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

export default withRouter(function PageWithHeader({
                                                    loading,
                                                    avatarUrl,
                                                    avatarIcon,
                                                    badgeStatus,
                                                    badgeText,
                                                    descriptionsList,
                                                    location,
                                                    children,
                                                    col,
                                                    title,
                                                    tabList,
                                                    tabActiveKey,
                                                    onTabChange
                                                  }: IPageWithHeaderProps) {

  const breadcrumb = { breadcrumbNameMap, location };

  const pageTitle = (
    <div className={ styles.titleWrapper }>
      <Loading isLoading={ loading } isFullScreen={ false }/>
      <span>{ title }</span>
      { badgeStatus ? <Badge className={ styles.badgeStatus } status={ badgeStatus } text={ badgeText }/> : null }
    </div>
  );

  const content = descriptionsList ? (
    <DescriptionList style={ { marginBottom: '1.5rem' } } title={ null } col={ col || 3 }>
      { descriptionsList.map(descriptionRender) }
    </DescriptionList>
  ) : null;

  return (
    <div style={ { margin: '-1.5rem' } }>
      <PageHeader
        linkElement={ Link }
        style={ { position: 'relative' } }
        logo={ avatarIcon ? <Avatar icon={ avatarIcon } src={ avatarUrl }/> : void 0 }
        title={ pageTitle }
        tabList={ tabList }
        tabActiveKey={ tabActiveKey }
        onTabChange={ onTabChange }
        content={ content }
        { ...breadcrumb }
      />
      <div style={ { padding: '1.5rem' } }>
        { children }
      </div>
    </div>
  );
});
