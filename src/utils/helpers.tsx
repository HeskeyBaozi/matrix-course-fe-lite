import DescriptionList from '@/components/common/DescriptionList';
import { Icon } from 'antd';

const { Description } = DescriptionList;

export interface IDescriptionItem {
  term: string;
  key: string;
  icon: string;
  value: any;
}

export function descriptionRender({ term, key, icon, value }: IDescriptionItem) {
  return (
    <Description key={ key } term={ <span><Icon type={ icon }/> { term }</span> }>
      { value }
    </Description>
  );
}

export function getBadgeStatus(isSubmitted: boolean, grade: number | null, standardScore: number): [
  'success' | 'processing' | 'default' | 'error' | 'warning', string
  ] {
  const percent = (grade || 0) * 100 / standardScore;
  return isSubmitted ? (
    grade !== null ? (percent < 60 ? [ 'error', '已批改 低分数' ] : [ 'success', '已批改' ]) : [ 'processing', '已提交 未批改' ]
  ) : [ 'default', '未提交' ];
}

export function statusFromGrade(grade: number | null,
                                [ none, ing, ok ]: [ any, any, any | [ any, any ] ], full?: number) {
  return grade === null ? none : (grade === -1 ? ing : (
    Array.isArray(ok) && full ? ((grade * 100 / full) >= 60 ? ok[ 0 ] : ok[ 1 ]) : ok
  ));
}
