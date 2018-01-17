import React, { SyntheticEvent } from 'react';
import { Tooltip, Form, Input, Icon, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { Loading } from '@/components/Loading/loading.component';
import { action, autorunAsync, observable, IReactionDisposer } from 'mobx';
import { RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/lib/form';
import styles from './login.component.less';
import avatarUrl from '@/assets/images/avatar.jpg';
import { LoginModel } from '@/models/login.model';
import classNames from 'classnames';
import { LoginBody } from '@/api/user';
import { asyncAction } from 'mobx-utils';


const { Item } = Form;

interface LoginComponentProps extends RouteComponentProps<{}>, FormComponentProps {
  $Login?: LoginModel;
}


@inject('$Login')
@observer
class LoginComponent extends React.Component<LoginComponentProps> {
  @observable
  username = '';

  @observable
  isCaptchaLoading = false;

  @observable
  isAvatarLoading = false;

  @action
  handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.username = e.currentTarget.value
  };

  submit = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    const { form: { validateFields }, $Login } = this.props;
    validateFields({ force: true }, (error, { username, password, captcha }: LoginBody) => {
      if (!error) {
        $Login!.login({ username, password, captcha });
      }
    });
  };

  @asyncAction
  * changeCaptcha() {
    this.isCaptchaLoading = true;
    yield new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    yield this.props.$Login!.captchaFlow();
    this.isCaptchaLoading = false;
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

    const Captcha = $('captcha', {
      rules: [{ required: !!$Login!.captchaUrl, message: '请输入验证码' }]
    })(<Input placeholder={ '验证码' } prefix={ <Icon type="edit"/> }/>);

    return (
      <Form onSubmit={ this.submit }>
        <Item>
          <div className={ styles.avatarWrapper }>
            <Loading isLoading={ this.isAvatarLoading } isFullScreen={ false } showTips={ false }/>
            <img src={ $Login!.avatar ? $Login!.avatar : avatarUrl } alt={ 'avatar' }/>
          </div>
        </Item>
        <Item>{ UserName }</Item>
        <Item>{ Password }</Item>

        <Item className={ classNames({ [styles.hidden]: !$Login!.captchaUrl }) }>
          <div className={ styles.captchaWrapper }>
            { Captcha }
            <Tooltip title={ '点击以更换验证码' } trigger={ 'hover' }>
              <div className={ styles.captchaImageWrapper }>
                <Loading isLoading={ this.isCaptchaLoading } isFullScreen={ false } showTips={ false }/>
                <img onClick={ this.changeCaptcha.bind(this) } className={ styles.captcha } src={ $Login!.captchaUrl }
                     alt={ 'captcha' }/>
              </div>
            </Tooltip>
          </div>
        </Item>

        <div className={ styles.container }>
          <Button className={ styles.submit } type={ 'primary' } htmlType={ 'submit' }>LOG IN</Button>
        </div>
      </Form>
    );
  }
}


export default Form.create({})(LoginComponent);

