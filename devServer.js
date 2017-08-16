const path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      session = require('express-session');

const app = express();
const port = 7770;

mongoose.connect('mongodb://sergejnosko:1024@ds145283.mlab.com:45283/calendar', {useMongoClient: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB");
});
const Schema = mongoose.Schema;
const MongoStore = require('connect-mongo')(session);
const userSchema = new Schema({username: String, password: String});
const User = mongoose.model('User', userSchema);

import React from 'react';
import { renderToString } from 'react-dom/server'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import counterApp from './client/reducers';
import App from './client/components/App';

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(session({
    secret: 'secretxx',
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

const initialState = {
    username: null
};

app.get('/', (req, res) => {
    let preloadedState = initialState;
    if(req.session.username){
        preloadedState.username = req.session.username;
        User.findOne({name: req.session.username}, (err, user) => {
            if(err) console.log(err);
            if(user){
                /*add some specific user information to the preloadedState*/
            }
            const store = createStore(counterApp, preloadedState);

            const html = renderToString(
                <Provider store={store}>
                    <App />
                </Provider>
            );

            const finalState = store.getState();

            res.send(renderFullPage(html, finalState));
        });
    } else{
        const store = createStore(counterApp, preloadedState);

        const html = renderToString(
            <Provider store={store}>
                <App />
            </Provider>
        );

        const finalState = store.getState();

        res.send(renderFullPage(html, finalState));
    }
});

app.post('/', (req, res) => {

});

function handleRender(req, res) {
    const name = req.body.name;

    const store = createStore(counterApp, {name});

    const html = renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    );

    const finalState = store.getState();

    res.send(renderFullPage(html, finalState));
}

function renderFullPage(html, preloadedState) {
    return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
      </body>
    </html>
    `
}

app.listen(port, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log(`Listening at http://localhost:${port}`);
});