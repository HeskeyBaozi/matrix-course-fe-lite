import React from 'react';
import { Alert, Form, Input, Icon } from 'antd';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import styles from './login.component.less';
import { MButton } from '@/components/basic-components';

const { Item } = Form;

interface LoginComponentProps extends RouteComponentProps<{}>, FormComponentProps {

}

@observer
class LoginComponent extends React.Component<LoginComponentProps> {
  @observable
  notice = '';

  render() {
    const { form: { getFieldDecorator: $ } } = this.props;

    const UserName = $('username', {
      rules: [{ required: true, message: '请输入用户名' }]
    })(<Input placeholder={ '账号' } prefix={ <Icon type={ 'user' }/> }/>);
    const Password = $('password', {
      rules: [{ required: true, message: '请输入密码' }]
    })(<Input type={ 'password' } placeholder={ '密码' } prefix={ <Icon type={ 'lock' }/> }/>);

    return (
      <Form onSubmit={ () => null }>
        {
          this.notice &&
          <Item><Alert message={ this.notice } type={ 'error' } showIcon closable/></Item>
        }
        <Item>{ UserName }</Item>
        <Item>{ Password }</Item>
        <div className={ styles.container }>
          <MButton type={ 'primary' } htmlType={ 'submit' }>LOG IN</MButton>
        </div>
      </Form>
    );
  }
}

export default Form.create({})(LoginComponent);

