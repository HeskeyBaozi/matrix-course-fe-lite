import classNames from 'classnames';
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import MathJax from 'react-mathjax';
import PrismCode from 'react-prism';
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
  math: renderMath
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
    <div className={ styles.math }>
      <MathJax.Node>
        { value }
      </MathJax.Node>
    </div>
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
  const klassNames = classNames(`language-${props.language}`, styles.codeFamily);
  return (
    <PrismCode className={ klassNames } component={ 'pre' }>{ props.value }</PrismCode>
  );
}

function renderInlineCode(props: { value: string, language: string }) {
  return (
    <PrismCode
      className={ classNames(styles.codeFamily, styles.inlineCode) }
      component={ 'code' }
    >
      { props.value }
    </PrismCode>
  );
}