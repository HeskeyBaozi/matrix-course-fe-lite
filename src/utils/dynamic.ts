import Loadable from 'react-loadable';
import { ComponentType } from 'react';

export function dynamic(resolve: () => Promise<ComponentType<any> | { default: ComponentType<any> }>) {
  return Loadable({
    loader: resolve,
    loading: () => null
  });
}
