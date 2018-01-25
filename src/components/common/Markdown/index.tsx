import classNames from 'classnames';
import 'highlight.js/styles/atom-one-light.css';
import React from 'react';
import Highlight from 'react-highlight';
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown';
import MathJax from 'react-mathjax';
import RemarkMathPlugin from 'remark-math';
import styles from './index.less';

interface IMarkdownProps {
  source: string;
}

const { Context, Node } = MathJax;

export default class Markdown extends React.PureComponent<IMarkdownProps> {
  render() {
    const { source } = this.props;
    const renderers = {
      code: renderCode,
      image: renderPicture,
      inlineCode: renderInlineCode,
      inlineMath: renderInlineMath,
      math: renderMath
    };
    const rest = {
      plugins: [ RemarkMathPlugin ]
    };
    return (
      <Context>
        <ReactMarkdown source={ source } renderers={ renderers } {...rest} />
      </Context>
    );
  }
}

function renderMath({ value }: { value: string }) {
  return (
    <Node>{ value }</Node>
  );
}

function renderInlineMath({ value }: { value: string }) {
  return (
    <Node inline={ true }>{ value }</Node>
  );
}

function renderPicture({ src }: { src: string }) {
  return (
    <img src={ src } className={ styles.image } />
  );
}

function renderCode(props: { value: string, language: string }) {
  // tslint:disable-next-line:no-console
  console.log(props);

  const klassNames = classNames(props.language, styles.codeFamily);
  return (
    <Highlight
      className={ klassNames }
    >{ props.value }
    </Highlight>
  );
}

function renderInlineCode(props: { value: string, language: string }) {
  // tslint:disable-next-line:no-console
  console.log(props);
  const klassNames = classNames(styles.codeFamily, styles.inlineCode);
  return (
    <code className={ klassNames }>{ props.value }</code>
  );
}
