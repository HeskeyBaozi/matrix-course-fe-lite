import Loadable from 'react-loadable';
import { ComponentType } from 'react';

export function dynamic(resolve: () => Promise<ComponentType<any> | { default: ComponentType<any> }>) {
  return Loadable({
    loader: resolve,
    loading: () => null
  });
}

// Dynamic Layouts
export const LoginLayout = dynamic(() => import('@/layouts/Login'));
export const BasicLayout = dynamic(() => import('@/layouts/Basic'));

// Dynamic Routes
export const LoginRoute = dynamic(() => import('@/routes/Login'));
export const ProfileRoute = dynamic(() => import('@/routes/Profile'));

// Dynamic Components
export const ParticlesComponent = dynamic(() => import('@/components/Particles'));
