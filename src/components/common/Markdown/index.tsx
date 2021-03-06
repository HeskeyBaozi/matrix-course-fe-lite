import CodeBlock from '@/components/common/CodeBlock';
import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import MathJax from 'react-mathjax';
import RemarkMathPlugin from 'remark-math';
import styles from './index.less';

interface IMarkdownProps {
  source: string;
}

const renderers = {
  code: renderCode,
  image: renderPicture,
  inlineCode: renderInlineCode,
  inlineMath: renderInlineMath,
  math: renderMath,
  table: renderTable
};

const markdownPlugins = { plugins: [ RemarkMathPlugin ] };

export default class Markdown extends React.PureComponent<IMarkdownProps> {
  render() {
    const { source } = this.props;
    return (
      <MathJax.Context>
        <ReactMarkdown source={ source } renderers={ renderers } { ...markdownPlugins } />
      </MathJax.Context>
    );
  }
}

function renderMath({ value }: { value: string }) {
  return (
    <MathJax.Node>
      { value }
    </MathJax.Node>
  );
}

function renderInlineMath({ value }: { value: string }) {
  return (
    <MathJax.Node inline={ true }>
      { value }
    </MathJax.Node>
  );
}

function renderPicture({ src }: { src: string }) {
  return (
    <img src={ src } className={ styles.image }/>
  );
}

function renderCode(props: { value: string, language: string }) {
  return (
    <CodeBlock
      className={ styles.code }
      value={ props.value }
      markdown={ true }
      readOnly={ true }
      language={ props.language }
    />
  );
}

function renderInlineCode(props: { value: string, language: string }) {
  return (
    <span
      className={ classNames(styles.codeFamily, styles.inlineCode) }
    >
      { props.value }
    </span>
  );
}

function renderTable(props: any) {
  return (
    <table className={ styles.table }>
      { props.children }
    </table>
  );
}
