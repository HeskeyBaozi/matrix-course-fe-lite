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

export interface IAssignment<C extends { standard_score: number } = { standard_score: number }> {
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

export interface IProgrammingConfig {
  compilers: string[];
  grading: {
    'compile check': number;
    'google tests': number;
    'google tests detail': {};
    'memory check': number;
    'random tests': number;
    'standard tests': number;
    'static check': number;
    [key: string]: number | object;
  };
  limits: {
    memory: number;
    time: number;
  };
  submission: string[];
  standard_score: number;
}

export interface IProgrammingValgrindoutput {
  args: {
    argv: { exe: string };
    vargv: { arg: string[], exe: string };
  };
  error: Array<{
    kind: string;
    stack: {
      frame: Array<{
        dir?: string;
        file?: string;
        fn: string;
        ip: string;
        line?: string;
        obj: string;
      }>;
    };
    what?: string;
    tid: string;
    unique: string;
  }>;
  errorcounts: any | null;
  pid: string;
  ppid: string;
  preamble: {
    line: string[];
  };
  protocoltool: string;
  protocolversion: string;
  status: Array<{
    time: string;
    state: string;
  }>;
  suppcounts: any | null;
  tool: string;
}

export interface IProgrammingReport {
  'compile check'?: {
    'compile check': string;
    continue: boolean;
    grade: number;
  };
  'memory check'?: {
    continue: boolean;
    grade: number;
    'memory check': Array<{
      stdin: string;
      message?: string;
      valgrindoutput: IProgrammingValgrindoutput;
    }>;
  };
  'standard tests'?: {
    continue: boolean;
    grade: number;
    'standard tests': Array<{
      memoryused?: number;
      message: string;
      result: string;
      stdin: string;
      stdout: string;
      timeused?: number;
      memorylimit?: number;
      timelimit?: number;
      standard_stdout?: string;
    }>;
  };
  'static check'?: {
    continue: boolean;
    grade: number;
    'static check': {
      clangStaticAnalyzer: any[];
      summary: {
        numberOfFiles: number;
        numberOfFilesWithViolations: number;
        numberOfViolationsWithPriority: Array<{ number: number, priority: number }>
      };
      timestamp: number;
      url: string;
      version: string;
      violation: Array<{
        category: string;
        endColumn: number;
        endLine: number;
        message?: string;
        path: string;
        priority: number;
        rule: string;
        startColumn: number;
        startLine: number;
      }>;
    };
  };
  'random tests'?: {
    continue: boolean;
    grade: number;
    'random tests': Array<{
      memoryused?: number;
      message?: string;
      re_signum: number;
      result: string;
      standard_stdout?: string;
      stdin: string;
      stdout: string;
      timeused?: number;
      memorylimit?: number;
      timelimit?: number;
    }>;
  };
  'google tests'?: {
    continue: boolean;
    grade: number;
    'google tests': Array<{
      gtest: {
        grade: number;
        failure: Array<{ [key: string]: number }>;
        info: {
          [key: string]: string;
        };
      };
      message?: string;
    }>;
  };
}

export interface ISubmission<A, R> {
  answers: A[];
  grade: number | null;
  report: R | null;
  sub_ca_id: number;
}

export interface IRanksItem {
  grade: number;
  lastSubmissionTime: string;
  nickname: string;
  submissionTimes: number;
  user_id: number;
}

export interface IProgrammingSubmitDetail {
  answers: Array<{ name: string, code: string }>;
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

export interface IMapper {
  [ key: string ]: string;
}
