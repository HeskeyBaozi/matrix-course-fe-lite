import { IBreadCrumbNameMap } from '@/types';

// tslint:disable:object-literal-sort-keys
export const breadcrumbNameMap: IBreadCrumbNameMap = {
  '/courses': { name: '课程', component: true },
  '/course/:course_id': { name: '课程详情', component: true },
  '/course/:course_id/home': { name: '课程概览', component: true },
  '/course/:course_id/assignments': { name: '课程作业', component: true },
  '/course/:course_id/discussions': { name: '课程讨论', component: true },
  '/course/:course_id/assignment/:ca_id': { name: '作业详情', component: true },
  '/course/:course_id/assignment/:ca_id/home': { name: '作业概览', component: true }
};

export enum AssignmentTimeStatus {
  NotStarted, InProgressing, OutOfDate
}
