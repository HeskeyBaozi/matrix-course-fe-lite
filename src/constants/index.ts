import { IBreadCrumbNameMap } from '@/types';

// tslint:disable:object-literal-sort-keys

export const breadcrumbNameMap: IBreadCrumbNameMap = {
  '/courses': { name: '课程' },
  '/course/:courseId': { name: '课程详情' },
  '/course/:courseId/assignments': { name: '作业' },
  '/course/:courseId/discussions': { name: '讨论' }
};
