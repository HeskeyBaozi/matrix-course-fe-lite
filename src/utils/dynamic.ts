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
export const OneCourseAssignmentsRoute = dynamic(() => import('@/routes/OneCourse/Assignments'));
export const OneCourseDiscussionsRoute = dynamic(() => import('@/routes/OneCourse/Discussions'));

export const OneAssignmentRoute = dynamic(() => import('@/routes/OneAssignment'));
export const OneAssignmentProgrammingRoute = dynamic(() => import('@/routes/OneAssignment/Programming'));
export const OneAssignmentChoiceRoute = dynamic(() => import('@/routes/OneAssignment/Choice'));
export const OneAssignmentFileUploadRoute = dynamic(() => import('@/routes/OneAssignment/FileUpload'));
export const OneAssignmentProgramOutputRoute = dynamic(() => import('@/routes/OneAssignment/ProgramOutput'));
export const OneAssignmentReportRoute = dynamic(() => import('@/routes/OneAssignment/Report'));
export const OneAssignmentShortAnswerRoute = dynamic(() => import('@/routes/OneAssignment/ShortAnswer'));

// Dynamic Components
export const ParticlesComponent = dynamic(() => import('@/components/Particles'));
