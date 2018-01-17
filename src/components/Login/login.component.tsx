import React, { SyntheticEvent } from 'react';
import { Alert, Form, Input, Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import { action, autorunAsync, IObservable, IObservableValue, observable, IReactionDisposer } from 'mobx';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import styles from './login.component.less';
import { MButton } from '@/components/basic-components';
import avatarUrl from '@/assets/images/avatar.jpg';
import { LoginModel } from '@/models/login.model';

const { Item } = Form;

interface LoginComponentProps extends RouteComponentProps<{}>, FormComponentProps {
  $Login?: LoginModel;
}

@inject('$Login')
@observer
class LoginComponent extends React.Component<LoginComponentProps> {
  @observable
  notice = '';

  @observable
  username = '';

  @observable
  avatar = avatarUrl;

  @action
  handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.username = e.currentTarget.value
  };

  disposer: IReactionDisposer;

  componentDidMount() {
    const { $Login } = this.props;
    this.disposer = autorunAsync(() => {
      if (this.username.length > 5) {
        $Login!.FetchUserAvatar({ username: this.username });
      }
    }, 1500);
  }

  componentWillUnmount() {
    this.disposer();
  }

  render() {
    const { form: { getFieldDecorator: $ }, $Login } = this.props;

    const UserName = $('username', {
      rules: [{ required: true, message: '请输入用户名' }]
    })(<Input onChange={ this.handleChange } placeholder={ '账号' } prefix={ <Icon type={ 'user' }/> }/>);
    const Password = $('password', {
      rules: [{ required: true, message: '请输入密码' }]
    })(<Input type={ 'password' } placeholder={ '密码' } prefix={ <Icon type={ 'lock' }/> }/>);

    return (
      <Form onSubmit={ () => null }>
        {
          this.notice &&
          <Item><Alert message={ this.notice } type={ 'error' } showIcon closable/></Item>
        }
        <Item>
          <div className={ styles.avatarWrapper }>
            <img src={ $Login!.avatar ? $Login!.avatar : avatarUrl } alt={ 'avatar' }/>
          </div>
        </Item>
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

