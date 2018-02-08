import Markdown from '@/components/common/Markdown';
import { Icon, Input, Tabs } from 'antd';
import { computed } from 'mobx';
import React, { SyntheticEvent } from 'react';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

interface IMarkdownEditorProps {
  value?: string;
  onValueChange?: (next: string) => any;
  onChange?: (e: SyntheticEvent<HTMLTextAreaElement>) => any;
  minRows?: number;
}

export default class MarkdownEditor extends React.PureComponent<IMarkdownEditorProps> {

  handleChange = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(e.currentTarget.value);
    }
  }

  @computed
  get Preview() {
    return (
      <span><Icon type={ 'eye-o' }/> Preview</span>
    );
  }

  @computed
  get Edit() {
    return (
      <span><Icon type={ 'edit' }/> Edit</span>
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
      <Tabs defaultActiveKey={ '1' } size={ 'small' }>
        <TabPane tab={ this.Edit } key={ '1' }>
          <TextArea
            value={ this.props.value }
            onChange={ this.handleChange }
            autosize={ this.autoSize }
          />
        </TabPane>
        <TabPane tab={ this.Preview } key={ '2' }>
          <Markdown source={ this.props.value || '' }/>
        </TabPane>
      </Tabs>
    );
  }
}
