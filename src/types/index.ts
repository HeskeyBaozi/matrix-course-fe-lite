export interface BreadCrumbNameMap {
  [ path: string ]: {
    name: string;
    href?: string;
    component?: boolean;
    hideInBreadcrumb?: boolean;
  }
}

export interface tabItem {
  key: string;
  tab: string;
}
