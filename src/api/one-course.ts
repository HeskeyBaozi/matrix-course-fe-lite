import { xios } from '@/api/instance';
import { IMatrixResponse, IOneCourse } from '@/api/interface';

/******************************
 *           Detail
 ******************************/

// https://api.vmatrix.org.cn/#/course/get_api_courses__course_id_
export function fetchCourseDetail({ courseId }: { courseId: number }) {
  return xios.get<IMatrixResponse<IOneCourse>>(`/api/courses/${courseId}`);
}

// https://api.vmatrix.org.cn/#/course/get_api_courses__course_id__personalRank
export function fetchCoursePersonalRank({ courseId }: { courseId: number }) {
  return xios.get<IMatrixResponse<any>>(`/api/courses/${courseId}/personalRank`);
}

// https://api.vmatrix.org.cn/#/course/get_api_courses__course_id__personalgrades
export function fetchCoursePersonalGrades({ courseId }: { courseId: number }) {
  return xios.get<IMatrixResponse<any>>(`/api/courses/${courseId}/personalgrades`);
}

/******************************
 *        Assignments
 ******************************/

// https://api.vmatrix.org.cn/#/course_assignment/get_api_courses__course_id__assignments
export function fetchAssignments({ courseId }: { courseId: number }) {
  return xios.get<IMatrixResponse<any>>(`/api/courses/${courseId}/assignments`);
}

/******************************
 *         Discussions
 ******************************/

// https://api.vmatrix.org.cn/#/course_discussion/get_api_courses__course_id__discussion
export function fetchCourseDiscussions({ courseId }: { courseId: number }) {
  return xios.get<IMatrixResponse<any>>(`/api/courses/${courseId}/discussion`);
}
