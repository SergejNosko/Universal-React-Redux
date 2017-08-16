import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import Main from '../../components/Main';
import rootReducer from '../../reducers/index';

const preloadedState = window.__PRELOADED_STATE__;

delete window.__PRELOADED_STATE__;

const enhancers = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(rootReducer, preloadedState, enhancers);

render(
    <Provider store={store}>
        <Main />
    </Provider>,
    document.getElementById('root')
);