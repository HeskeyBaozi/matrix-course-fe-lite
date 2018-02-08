import Markdown from '@/components/common/Markdown';
import { Icon, Input, Tabs } from 'antd';
import { computed } from 'mobx';
import React, { SyntheticEvent } from 'react';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

interface IMarkdownEditorProps {
  value: string;
  onChange: (next: string) => any;
  minRows?: number;
}

export default class MarkdownEditor extends React.PureComponent<IMarkdownEditorProps> {

  handleChange = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    this.props.onChange(e.currentTarget.value);
  }

  @computed
  get Preview() {
    return (
      <span><Icon type={ 'eye-o' }/> 预览</span>
    );
  }

  @computed
  get Edit() {
    return (
      <span><Icon type={ 'edit' }/> 编辑</span>
    );
  }

  @computed
  get autoSize() {
    return {
      minRows: this.props.minRows || 4
    };
  }

  render() {
    return (
      <Tabs defaultActiveKey={ '1' }>
        <TabPane tab={ this.Edit } key={ '1' }>
          <TextArea
            value={ this.props.value }
            onChange={ this.handleChange }
            autosize={ this.autoSize }
            placeholder={ '欢迎使用 Markdown 语法...' }
          />
        </TabPane>
        <TabPane tab={ this.Preview } key={ '2' }>
          <Markdown source={ this.props.value }/>
        </TabPane>
      </Tabs>
    );
  }
}
