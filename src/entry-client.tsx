import dva from 'dva';
import { createBrowserHistory } from 'history';
import RouterConfig from './router';
import React from 'react';

// global styles
import 'normalize.css';
import './index.less';

const app = dva({
  history: createBrowserHistory()
});

// Router
app.router(RouterConfig as any);


// Start!
app.start('#app');
