import { xios, xiosSilence } from '@/api/instance';
import { IAssignment, IMatrixResponse, IRanksItem, ISubmissionItem } from '@/types/api';

export interface IOneAssignmentArgs {
  course_id: number;
  ca_id: number;
}

export interface IOneAssignmentOneSubmissionArgs extends IOneAssignmentArgs {
  sub_ca_id: number;
}

// https://api.vmatrix.org.cn/#/course_assignment/get_api_courses__course_id__assignments__ca_id_
export function FetchAssignmentDetail({ course_id, ca_id }: IOneAssignmentArgs) {
  return xios.get<IMatrixResponse<IAssignment>>(`/api/courses/${course_id}/assignments/${ca_id}`);
}

// https://api.vmatrix.org.cn/#/course_assignment_submission
// /get_api_courses__course_id__assignments__ca_id__submissions_last
export function FetchLastSubmission<S>({ course_id, ca_id }: IOneAssignmentArgs) {
  return xiosSilence.get<IMatrixResponse<S>>(`/api/courses/${course_id}/assignments/${ca_id}/submissions/last`);
}

// https://api.vmatrix.org.cn/#/course_assignment_submission/get_api_courses__course_id__assignments__ca_id__submissions
export function FetchSubmissionsList({ course_id, ca_id }: IOneAssignmentArgs) {
  return xios.get<IMatrixResponse<ISubmissionItem[]>>(`/api/courses/${course_id}/assignments/${ca_id}/submissions`);
}

// https://api.vmatrix.org.cn/#/course_assignment_submission
// /get_api_courses__course_id__assignments__ca_id__submissions__sub_ca_id_
export function FetchOneSubmission<S>({ course_id, ca_id, sub_ca_id }: IOneAssignmentOneSubmissionArgs) {
  return xios.get<IMatrixResponse<S>>(`/api/courses/${course_id}/assignments/${ca_id}/submissions/${sub_ca_id}`);
}

// https://api.vmatrix.org.cn/#/course_assignment/get_api_courses__course_id__assignments__ca_id__rank
export function FetchAssignmentRank({ course_id, ca_id }: IOneAssignmentArgs) {
  return xios.get<IMatrixResponse<IRanksItem[]>>(`/api/courses/${course_id}/assignments/${ca_id}/rank`);
}

// https://api.vmatrix.org.cn/#/course_assignment_submission
// /post_api_courses__course_id__assignments__ca_id__submissions
export function PostOneSubmissions<D>({ course_id, ca_id }: IOneAssignmentArgs, detail: D) {
  return xios.post<IMatrixResponse<{ sub_asgn_id: number }>>(
    `/api/courses/${course_id}/assignments/${ca_id}/submissions`, { detail }
  );
}
