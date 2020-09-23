import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { reducer } from './redux/reducer';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

const store = createStore(reducer, applyMiddleware(thunk) );

ReactDOM.render(
  <React.StrictMode>

    <Provider store={store}>
      <App />
    </Provider>
 
  </React.StrictMode>,
  document.getElementById('root')
);

// serviceWorker.unregister();
