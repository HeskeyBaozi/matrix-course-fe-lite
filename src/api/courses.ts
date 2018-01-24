import { xios } from '@/api/instance';
import { MatrixResponse, CoursesItem } from '@/api/interface';

// https://api.vmatrix.org.cn/#/course/get_api_courses
export function fetchCoursesList() {
    return xios.get<MatrixResponse<CoursesItem[]>>('/api/courses');
}