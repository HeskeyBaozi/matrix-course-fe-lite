import { xios } from '@/services/instance';
import { ICoursesItem, IMatrixResponse } from '@/types/api';

// https://api.vmatrix.org.cn/#/course/get_api_courses
export function fetchCoursesList() {
    return xios.get<IMatrixResponse<ICoursesItem[]>>('/api/courses');
}
