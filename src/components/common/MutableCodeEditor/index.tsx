import CodeBlock from '@/components/common/CodeBlock';
import { Tabs } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

const { TabPane } = Tabs;

export interface ICodeEditorDataSource {
  [key: string]: {
    readOnly: boolean;
    value: string;
  };
}

interface ICodeEditor {
  mutableDataSource: ICodeEditorDataSource;
  extra?: React.ReactNode;
}

@observer
export default class MutableCodeEditor extends React.Component<ICodeEditor> {

  @computed
  get sourceToList() {
    const { mutableDataSource } = this.props;
    return Object.keys(mutableDataSource).map((key) => ({ key, source: mutableDataSource[ key ] }));
  }

  @computed
  get first() {
    return this.sourceToList.length ? this.sourceToList[ 0 ] : void 0;
  }

  render() {
    return (
      <Tabs
        defaultActiveKey={ this.first && this.first.key || 'NONE' }
        type={ 'card' }
        tabBarExtraContent={ this.props.extra }
      >
        { this.sourceToList.map(renderTabPane) }
      </Tabs>
    );
  }
}

function renderTabPane({ key, source }: {
  key: string, source: {
    readOnly: boolean;
    value: string;
  }
}) {

  return (
    <TabPane key={ key } tab={ key }>
      <CodeBlock
        readOnly={ source.readOnly }
        value={ source.value }
        filename={ key }
        mutableSource={ source }
      />
    </TabPane>
  );
}
