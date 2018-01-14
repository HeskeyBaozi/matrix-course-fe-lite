import dva from 'dva';
import { createBrowserHistory } from 'history';
import RouterConfig from './router';
import React from "react";

const app = dva({
  history: createBrowserHistory()
});

// Router
app.router(RouterConfig as any);


// Start!
app.start('#app');
