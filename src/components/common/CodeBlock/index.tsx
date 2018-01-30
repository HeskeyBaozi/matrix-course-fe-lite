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
  filename?: string;
  markdown?: boolean;
  value: string;
  readOnly: boolean;
  className?: string;
  onChange?: (key: string, value: string) => void;
}

@observer
export default class CodeBlock extends React.Component<ICodeBlockProps> {

  @observable
  code = this.props.value || '';

  @action
  onBeforeChange = (editor: IInstance, data: any, value: string) => {
    this.code = value;
  }

  @action
  onChangeLocal = (_1: any, _2: any, value: string) => {

    const { filename, onChange } = this.props;
    if (onChange && filename) {
      onChange(filename, value);
    }
  }

  @computed
  get CodeOptions() {
    const { readOnly, language, markdown, filename } = this.props;
    return {
      mode: language && getMimeFromExt(language) || getMimeFromExt(getExt(filename || '')),
      theme: 'github',
      tabSize: 2,
      lineNumbers: !markdown,
      readOnly: readOnly ? (markdown ? 'nocursor' : true) : false
    };
  }

  render() {
    return (
      <CodeMirror
        className={ this.props.className }
        value={ this.code }
        options={ this.CodeOptions }
        onBeforeChange={ this.onBeforeChange }
        onChange={ this.onChangeLocal }
      />
    );
  }
}

const reg = /\.[^.]+$/;

function getExt(filename: string) {
  const result = reg.exec(filename);
  return result && result[ 0 ].replace('.', '') || 'txt';
}
