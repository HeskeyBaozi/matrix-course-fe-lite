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
export const LoginRoute = dynamic(() => import('@/pages/Login'));
export const ProfileRoute = dynamic(() => import('@/pages/Profile'));
export const CoursesRoute = dynamic(() => import('@/pages/Courses'));

export const OneCourseRoute = dynamic(() => import('@/pages/OneCourse'));
export const OneCourseHomeRoute = dynamic(() => import('@/pages/OneCourse/Home'));
export const OneCourseAssignmentsRoute = dynamic(() => import('@/pages/OneCourse/Assignments'));
export const OneCourseDiscussionsRoute = dynamic(() => import('@/pages/OneCourse/Discussions'));

export const OneAssignmentRoute = dynamic(() => import('@/pages/OneAssignment'));
export const OneAssignmentProgrammingRoute = dynamic(() => import('@/pages/OneAssignment/Programming'));
export const OneAssignmentChoiceRoute = dynamic(() => import('@/pages/OneAssignment/Choice'));
export const OneAssignmentFileUploadRoute = dynamic(() => import('@/pages/OneAssignment/FileUpload'));
export const OneAssignmentProgramOutputRoute = dynamic(() => import('@/pages/OneAssignment/ProgramOutput'));
export const OneAssignmentReportRoute = dynamic(() => import('@/pages/OneAssignment/Report'));
export const OneAssignmentShortAnswerRoute = dynamic(() => import('@/pages/OneAssignment/ShortAnswer'));

// Dynamic Components
export const ParticlesComponent = dynamic(() => import('@/components/Particles'));
