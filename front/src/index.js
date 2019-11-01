import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from './components/Context/Context';
import App from './App';
import AppRestrained from './AppRestrained';

ReactDOM.render(
  <Provider>
    {/* <App /> */}
    <AppRestrained />
  </Provider>,
  document.getElementById('root')
);
