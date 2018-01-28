export interface IBreadCrumbNameMap {
  [ path: string ]: {
    name: string;
    href?: string;
    component?: boolean;
    hideInBreadcrumb?: boolean;
  };
}

export interface ItabItem<K = string> {
  key: K;
  tab: string;
  icon?: string;
}
