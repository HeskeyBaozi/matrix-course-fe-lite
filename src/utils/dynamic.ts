import Loadable from 'react-loadable';
import { ComponentType } from 'react';

export function dynamic(resolve: () => Promise<ComponentType<any> | { default: ComponentType<any> }>) {
  return Loadable({
    loader: resolve,
    loading: () => null
  });
}

// Dynamic Layouts
export const LoginLayout = dynamic(() => import('@/layouts/Login/login.layout'));
export const BasicLayout = dynamic(() => import('@/layouts/Basic/basic.layout'));

// Dynamic Routes
export const LoginRoute = dynamic(() => import('@/routes/Login/login.route'));
export const ProfileRoute = dynamic(() => import('@/routes/Profile/profile.route'));

// Dynamic Components
export const ParticlesComponent = dynamic(() => import('@/components/Particles/particles.component'));
export const UserProfileComponent = dynamic(() => import('@/components/UserProfile/user-profile.component'));
export const CurrentCoursesComponent = dynamic(() => import('@/components/CurrentCourses/current-courses.component'));
