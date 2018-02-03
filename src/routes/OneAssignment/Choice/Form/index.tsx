import Markdown from '@/components/common/Markdown';
import { IChoiceConfig, IChoiceFormResultItem, IChoiceReport } from '@/types/OneAssignment/choice';
import { Alert, Button, Checkbox, Col, Divider, Form, Radio, Row } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { ReactNode, SyntheticEvent } from 'react';

interface IChoiceFormProps extends FormComponentProps {
  config: IChoiceConfig;
  onSubmit?: (result: IChoiceFormResultItem[]) => Promise<any>;
  report?: IChoiceReport | null;
}

@observer
class ChoiceForm extends React.Component<IChoiceFormProps> {

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

        const result: IChoiceFormResultItem[] = Object.keys(values).map((key: string) => ({
          question_id: Number.parseInt(key),
          choice_id: Array.isArray(values[ key ]) ? values[ key ] : [ values[ key ] ]
        }));

        this.toLoading();
        if (this.props.onSubmit) {
          await this.props.onSubmit(result);
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
  get normalizedReport() {
    const { report, config } = this.props;
    const { questions } = config;
    if (report) {
      const result = new Map<string, { your: string[], standard: string[], grade: number }>();
      for (const { grade, question_id, standard_answer, student_answer } of report.report) {
        const { choices } = questions[ question_id ];
        result.set(question_id.toString(), {
          grade,
          your: student_answer.map((id) => choices[ id ].description),
          standard: standard_answer.map((id) => choices[ id ].description)
        });
      }
      return result;
    }
    return report;
  }

  @computed
  get Questions() {
    const { config, form, report } = this.props;
    const { getFieldDecorator: $ } = form;
    return !(report || report === null) ? config.questions.map(({
                                                                  id, choice_type, choices, description, grading
                                                                }) => {
      let choicesList: ReactNode = null;
      let answersReport: ReactNode = null;
      if (choice_type === 'single') {
        const group = choices.map(({ id: cid, description: des }) => (
          <Col key={ cid } span={ 24 } style={ { marginTop: '.5rem' } }>
            <Radio value={ cid }>{ des }</Radio>
          </Col>
        ));
        choicesList = ($(id.toString(), { rules: [ { required: true, message: '请选择一个选项!' } ] })(
          <Radio.Group style={ { width: '100%' } }>
            <Row gutter={ 16 }>
              { group }
            </Row>
          </Radio.Group>
        ));
      } else if (choice_type === 'multi') {
        const group = choices.map(({ id: cid, description: des }) => (
          <Col key={ cid } span={ 24 } style={ { marginTop: '.5rem' } }>
            <Checkbox value={ cid }>{ des }</Checkbox>
          </Col>
        ));
        choicesList = ($(id.toString(), { rules: [ { required: true, message: '请至少选择一个选项!' } ] })(
          <Checkbox.Group style={ { width: '100%' } }>
            <Row gutter={ 16 }>
              { group }
            </Row>
          </Checkbox.Group>
        ));
      }

      if (this.normalizedReport) {
        if (!this.normalizedReport.get(id.toString())) {
          return null;
        }
        const isFull = this.normalizedReport.get(id.toString())!.grade === grading.max_grade;
        const StandardAnswer = isFull ? null : (
          <Alert
            type={ 'success' }
            showIcon={ true }
            message={ 'Standard' }
            style={ { marginTop: '1rem' } }
            description={ this.normalizedReport.get(id.toString())!.standard.join('\n') }
          />
        );
        answersReport = (
          <div>
            <Alert
              type={ isFull ? 'success' : 'error' }
              message={ 'My Answer' }
              showIcon={ true }
              style={ { marginTop: '1rem' } }
              description={ this.normalizedReport.get(id.toString())!.your.join('\n') }
            />
            { StandardAnswer }
          </div>
        );
      }
      return [ (
        <Form.Item
          key={ id }
          label={ <strong>{ `Question ${id} - ${grading.max_grade}pts` }</strong> }
          style={ { margin: '0' } }
          required={ false }
        >
          <Markdown source={ description }/>
          { !(report || report === null) ? choicesList : answersReport }
        </Form.Item>),
        <Divider key={ `${id}-divider` }/>
      ];
    }) : null;
  }

  @computed
  get Control() {
    const { report } = this.props;
    return !(report || report === null) ? (
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
    ) : null;
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

export default Form.create()(ChoiceForm);
