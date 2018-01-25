import { ComponentType } from 'react';
import Loadable from 'react-loadable';

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
export const CoursesRoute = dynamic(() => import('@/routes/Courses'));

export const OneCourseRoute = dynamic(() => import('@/routes/OneCourse'));
export const OneCourseHomeRoute = dynamic(() => import('@/routes/OneCourse/Home'));

// Dynamic Components
export const ParticlesComponent = dynamic(() => import('@/components/Particles'));
