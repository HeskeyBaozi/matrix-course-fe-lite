import { xios } from '@/api/instance';
import { MatrixResponse } from '@/api/interface';

// https://api.vmatrix.org.cn/#/course/get_api_courses__course_id_
export function fetchCourseDetail({ courseId }: { courseId: number }) {
  return xios.get<MatrixResponse<any>>(`/api/courses/${courseId}`);
}
