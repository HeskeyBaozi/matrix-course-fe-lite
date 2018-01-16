import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'normalize.css';
import { stores } from '@/models';
import { App } from '@/App';
import './index.less';

useStrict(true);


render((
  <Provider { ...stores }>
    <App/>
  </Provider>
), document.getElementById('app'));

