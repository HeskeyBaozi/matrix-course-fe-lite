import Markdown from '@/components/common/Markdown';
import MarkdownEditor from '@/components/common/MarkdownEditor';
import { IShortAnswerConfig } from '@/types/OneAssignment/short-answer';
import { Button, Divider, Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';

interface IShortAnswerFormProps extends FormComponentProps {
  config: IShortAnswerConfig;
  onSubmit?: (answers: string[]) => Promise<any>;
  answers?: string[];
}

@observer
class ShortAnswerForm extends React.Component<IShortAnswerFormProps> {

  @observable
  isBtnLoading = false;

  @action
  toLoading() {
    this.isBtnLoading = true;
  }

  @action
  noLoading() {
    this.isBtnLoading = false;
  }

  handleSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll({ force: true }, async (err, values) => {
      if (!err) {

        const result: string[] = Array.prototype.slice.call({ ...values, length: Object.keys(values).length });

        this.toLoading();
        if (this.props.onSubmit) {
          // await this.props.onSubmit(result);
          console.log(result);
        }
        this.noLoading();
      }
    });
  }

  handleReset = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.form.resetFields();
  }

  @computed
  get Questions() {
    const { config, form, answers } = this.props;
    const { getFieldDecorator: $ } = form;
    return config.questions.map(({
                                   id, description, grade, standard_answer, explanation
                                 }) => {
      let markdownEditor = null;
      if (answers) {
        markdownEditor = [ (
          <div key={ 'your-answer' }>
            <h3>Your Answer</h3>
            <Markdown source={ answers[ id ] || '' }/>
          </div>
        ) ];
        if (standard_answer) {
          markdownEditor.push((
            <div key={ 'standard-answer' }>
              <h3>Standard Answer</h3>
              <Markdown source={ standard_answer || 'No standard answer...' }/>
            </div>
          ));
        }
        if (explanation) {
          markdownEditor.push((
            <div key={ 'explanation' }>
              <h3>Explanation</h3>
              <Markdown source={ explanation || 'No explanation...' }/>
            </div>
          ));
        }
      } else {
        markdownEditor = ($(id.toString(), { rules: [ { required: true, message: '请填写答案!' } ] })(
          <MarkdownEditor/>
        ));
      }
      return [ (
        <Form.Item
          key={ id }
          label={ <strong>{ `Question ${id} - ${grade}pts` }</strong> }
          style={ { margin: '0' } }
          required={ false }
        >
          <Markdown source={ description }/>
          { markdownEditor }
        </Form.Item>),
        <Divider key={ `${id}-divider` }/>
      ];
    });
  }

  @computed
  get Control() {
    return this.props.answers ? null : (
      <Form.Item key={ 'submit' }>
        <div style={ { display: 'flex', justifyContent: 'space-between' } }>
          <Button
            loading={ this.isBtnLoading }
            type={ 'primary' }
            htmlType={ 'submit' }
            icon={ 'upload' }
          >Submit
          </Button>
          <Button
            loading={ this.isBtnLoading }
            htmlType={ 'reset' }
            icon={ 'reload' }
            onClick={ this.handleReset }
          >Reset
          </Button>
        </div>
      </Form.Item>
    );
  }

  render() {
    return (
      <Form layout={ 'vertical' } onSubmit={ this.handleSubmit }>
        { this.Questions }
        { this.Control }
      </Form>
    );
  }
}

export default Form.create()(ShortAnswerForm);
