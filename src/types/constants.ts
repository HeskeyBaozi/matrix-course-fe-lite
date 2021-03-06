import { IMapper } from '@/types/api';
import { IBreadCrumbNameMap } from '@/types/common';

// tslint:disable:object-literal-sort-keys
export const breadcrumbNameMap: IBreadCrumbNameMap = {
  '/courses': { name: '课程', component: true },
  '/course/:course_id': { name: '课程详情', component: true },
  '/course/:course_id/assignments': { name: '课程作业', component: true },
  '/course/:course_id/discussions': { name: '课程讨论', component: true },
  '/course/:course_id/assignment/:ca_id': { name: '作业详情', component: true }
};

export enum AssignmentTimeStatus {
  NotStarted, InProgressing, OutOfDate
}

export enum PType {
  Programming = 0,
  Choice = 1,
  Report = 2,
  FileUpload = 3,
  ProgramOutput = 4,
  ProgramBlankFilling = 5,
  ShortAnswer = 6
}

export type GeneralKey = ProgrammingKeys | ChoiceKeys | FileUploadKeys | ProgramOutputKeys | ReportKeys
  | ShortAnswerKeys;

export enum ProgrammingKeys {
  Description = 'description',
  Submit = 'submit',
  GradeFeedback = 'grade-feedback',
  Recordings = 'recordings',
  Rank = 'rank',
  StandardAnswer = 'standard-answer'
}

export enum ChoiceKeys {
  Description = 'description',
  GradeFeedback = 'grade-feedback',
  Recordings = 'recordings'
}

export enum FileUploadKeys {
  Description = 'description',
  GradeFeedback = 'grade-feedback',
  Recordings = 'recordings'
}

export enum ProgramOutputKeys {
  Description = 'description',
  GradeFeedback = 'grade-feedback',
  Recordings = 'recordings'
}

export enum ReportKeys {
  Description = 'description',
  Submit = 'submit',
  GradeFeedback = 'grade-feedback',
  Recordings = 'recordings'
}

export enum ShortAnswerKeys {
  Description = 'description',
  GradeFeedback = 'grade-feedback',
  Recordings = 'recordings'
}

export const TestResultMapper: IMapper = {
  WA: 'Wrong Answer',
  TL: 'Time Limit',
  CR: 'Correct',
  ML: 'Memory Limit',
  RE: 'Runtime Error',
  IE: 'Internal Error',
  OL: 'Output Limit'
};
