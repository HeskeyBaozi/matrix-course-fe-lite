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
