import CodeBlock from '@/components/common/CodeBlock';
import { Tabs } from 'antd';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

const { TabPane } = Tabs;

export type ICodeEditorDataSource = Map<string, { readOnly: boolean, value: string }>;

interface ICodeEditor {
  mutableDataSource: ICodeEditorDataSource;
  extraDataSource: ICodeEditorDataSource | null;
  extra?: React.ReactNode;
}

@observer
export default class MutableCodeEditor extends React.Component<ICodeEditor> {

  @computed
  get extraDataSource() {
    return this.props.extraDataSource;
  }

  @action
  onChange = (filename: string, value: string) => {
    const target = this.props.mutableDataSource.get(filename);
    if (target && !target.readOnly) {
      target.value = value;
    }
  }

  @computed
  get List() {
    return [ ...this.props.mutableDataSource.entries() ].map(([ key, target ]: [
      string, { readOnly: boolean, value: string }
      ]) => {
      return (
        <TabPane key={ key } tab={ key }>
          <CodeBlock
            readOnly={ target.readOnly }
            value={ target.value }
            filename={ key }
            onChange={ this.onChange }
          />
        </TabPane>
      );
    });
  }

  @computed
  get ExtraList() {
    return this.extraDataSource ? [ ...this.extraDataSource.entries() ].map(([ key, target ]: [
      string, { readOnly: boolean, value: string }
      ]) => {
      return (
        <TabPane key={ `extra-${key}` } tab={ `${key} (ReadOnly)` }>
          <CodeBlock
            readOnly={ true }
            value={ target.value }
            filename={ key }
            onChange={ this.onChange }
          />
        </TabPane>
      );
    }) : [];
  }

  render() {
    return (
      <Tabs type={ 'card' } tabBarExtraContent={ this.props.extra }>
        { this.List }
        { this.ExtraList }
      </Tabs>
    );
  }
}
