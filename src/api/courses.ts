import { xios } from '@/api/instance';
import { ICoursesItem, IMatrixResponse } from '@/api/interface';

// https://api.vmatrix.org.cn/#/course/get_api_courses
export function fetchCoursesList() {
    return xios.get<IMatrixResponse<ICoursesItem[]>>('/api/courses');
}
