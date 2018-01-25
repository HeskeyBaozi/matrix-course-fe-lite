import { App } from '@/App';
import { stores } from '@/models';
import { notification } from 'antd';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'particles.js';
import React from 'react';
import { render } from 'react-dom';
import './index.less';

notification.config({
  top: 24 + 64 // base + top-height
});

useStrict(true);

render((
  <Provider {...stores}>
    <App />
  </Provider>
), document.getElementById('app'));
