import { AssignmentTimeStatus, PType } from '@/types/constants';

export interface IMatrixResponse<T, P = {}> {
  data: T;
  msg: string;
  status: string;
  paramData: P;
  time: string;
}

// Captcha
export interface ICaptchaResult {
  data: {
    captcha: string;
  };
}

// User
export interface ILoginQueryResult extends IMatrixResponse<ILoginSuccessData | {}> {
  status: 'OK' | 'NOT_AUTHORIZED';
}

export interface ILoginBody {
  username: string;
  password: string;
  captcha?: string;
}

export interface ILoginErrorData {
  captcha?: boolean;
}

export interface ILoginSuccessData {
  realname: string;
}

export interface ILoginResult extends IMatrixResponse<ILoginErrorData | ILoginSuccessData> {
  status: 'WRONG_PASSWORD' | 'WRONG_CAPTCHA' | 'OK';
}

// Profile
export interface IUpdateProfileBody {
  email?: string | null;
  phone?: string | null;
  homepage?: string | null;
  nickname?: string | null;
}

interface IUser {
  email: string | null;
  homepage: string | null;
  phone: string | null;
  realname: string;
  username: string;

}

export interface IProfile extends IUser {
  is_valid: number;
  nickname: string;
  phone: string;
  user_addition: null | object;
  user_id: number;
}

// Courses
export interface ICoursesItem {
  course_id: number;
  course_name: string;
  creator: IUser;
  progressing_num: number;
  role: string;
  school_year: string;
  semester: string;
  status: 'open' | 'close';
  student_num: number;
  teacher: string;
  term: string;
  unfinished_num: number;
}

// One Course
export interface IOneCourse extends ICoursesItem {
  created_at: string;
  description: string;
  type: string;
}

export interface IAssignmentItem {
  asgn_id: number;
  ca_id: number;
  course_id: number;
  enddate: string;
  grade: number | null;
  grade_at_end: 0 | 1;
  last_submission_time: string | null;
  ptype_id: PType;
  standard_score: number;
  startdate: string;
  submit_limitation: number; // 0 = 无限制
  submit_times: number; // 已经提交的次数
  title: string;
  type: string;
}

export interface IDiscussionItem {
  answers: number | null;
  ca_id: number | null;
  date: string;
  id: number;
  lastDate: string | null;
  nickname: string;
  prob_title: string | null;
  prob_type: string | null;
  state: number;
  title: string;
  username: string;
  vote_bad: number | null;
  vote_great: number | null;
}

// One Assignment

export interface IAssignment<C = object> {
  asgn_id: number;
  author: {
    realname: string,
    email: string
  };
  ca_id: number;
  config: C;
  course_id: number;
  description: string;
  enddate: string;
  files?: Array<{ name: string, code: string }>;
  grade_at_end: 0 | 1; // 1 = 定时编程题
  plcheck: 0 | 1; // 抄袭检查
  ptype_id: PType;
  pub_answer: 0 | 1; // 1 = 结束公开答案
  standard_score: number;
  startdate: string;
  submit_limitation: number;
  title: string;
  type: string;
  updated_at: string;
}

export interface ISubmissionItem {
  grade: number | null;
  sub_ca_id: number;
  submit_at: string;
  user_id: number;
}

// General
export const RoleMap: IMapper = {
  TA: '助教',
  student: '学生',
  teacher: '教师'
};

export const CourseStatusMap: IMapper = {
  close: '已关闭',
  open: '进行中'
};

export const AssignmentTimeStatusMap: IBadgeMapper = {
  [ AssignmentTimeStatus.OutOfDate ]: 'default',
  [ AssignmentTimeStatus.InProgressing ]: 'processing',
  [ AssignmentTimeStatus.NotStarted ]: 'default'
};

export const AssignmentTimeStatusTextMap: IMapper = {
  [ AssignmentTimeStatus.OutOfDate ]: '已过截止日期',
  [ AssignmentTimeStatus.InProgressing ]: '进行中',
  [ AssignmentTimeStatus.NotStarted ]: '未开始'
};

interface IBadgeMapper {
  [key: string]: 'success' | 'error' | 'default' | 'processing' | 'warning';
}

interface IMapper {
  [ key: string ]: string;
}
