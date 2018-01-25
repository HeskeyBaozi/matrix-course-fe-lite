export interface IBreadCrumbNameMap {
  [ path: string ]: {
    name: string;
    href?: string;
    component?: boolean;
    hideInBreadcrumb?: boolean;
  };
}

export interface ItabItem {
  key: string;
  tab: string;
}
