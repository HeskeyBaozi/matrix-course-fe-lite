import { getMimeFromExt } from '@/components/common/CodeBlock/language';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Controlled as CodeMirror, IInstance } from 'react-codemirror2';
import './code.less';
import './github.theme.less';

interface ICodeBlockProps {
  language?: string;
  markdown?: boolean;
  value: string;
  readOnly: boolean;
}

@observer
export default class CodeBlock extends React.Component<ICodeBlockProps> {

  @observable
  code = this.props.value || '';

  @action
  onBeforeChange = (editor: IInstance, data: any, value: string) => {
    this.code = value;
  }

  @computed
  get CodeOptions() {
    const { readOnly, language, markdown } = this.props;
    console.log(language, getMimeFromExt(language));
    return {
      mode: getMimeFromExt(language),
      theme: 'github',
      tabSize: 2,
      lineNumbers: !markdown,
      readOnly: (markdown || readOnly) ? 'nocursor' : false
    };
  }

  render() {
    return (
      <CodeMirror
        value={ this.code }
        options={ this.CodeOptions }
        onBeforeChange={ this.onBeforeChange }
      />
    );
  }
}
