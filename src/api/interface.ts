export interface MatrixResponse<T, P = {}> {
  data: T;
  msg: string;
  status: string;
  paramData: P;
  time: string;
}

// User
export interface LoginQueryResult extends MatrixResponse<LoginSuccessData | {}> {
  status: 'OK' | 'NOT_AUTHORIZED';
}

export interface LoginBody {
  username: string;
  password: string;
  captcha?: string;
}

export interface LoginErrorData {
  captcha?: boolean;
}

export interface LoginSuccessData {
  realname: string;
}

export interface LoginResult extends MatrixResponse<LoginErrorData | LoginSuccessData> {
  status: 'WRONG_PASSWORD' | 'WRONG_CAPTCHA' | 'OK';
}

// Profile
export interface UpdateProfileBody {
  email?: string | null;
  phone?: string | null;
  homepage?: string | null;
  nickname?: string | null;
}

interface User {
  email: string | null;
  homepage: string | null;
  phone: string | null;
  realname: string;
  username: string;

}

export interface Profile extends User {
  is_valid: number;
  nickname: string;
  phone: string;
  user_addition: null | object;
  user_id: number;
}

// Courses
export interface CoursesItem {
  course_id: number;
  course_name: string;
  creator: User;
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
export interface OneCourse extends CoursesItem {
  created_at: string;
  type: string;
}


// General
export const RoleMap: Mapper = {
  student: '学生',
  teacher: '教师',
  TA: '助教'
};

export const CourseStatusMap: Mapper = {
  open: '进行中',
  close: '已关闭'
};

interface Mapper {
  [ key: string ]: string;
}
