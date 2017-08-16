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
const userSchema = new Schema({name: String, password: String});
const User = mongoose.model('User', userSchema);

import React from 'react';
import { renderToString } from 'react-dom/server'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import counterApp from './client/reducers/index';
import Main from './client/components/Main';

let webpack = require('webpack'),
   config = require('./webpack.config.dev'),
   compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(session({
    secret: 'secretxx',
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

function getInitialState(){
    return {
        username: null
    }
}

app.get('/', (req, res) => {
    let preloadedState = getInitialState();
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
                    <Main />
                </Provider>
            );

            const finalState = store.getState();

            res.send(renderFullPage(html, finalState));
            /*req.session.destroy(() => {
                console.log('destroyed');
            });*/
        });
    } else{
        const store = createStore(counterApp, preloadedState);

        const html = renderToString(
            <Provider store={store}>
                <Main />
            </Provider>
        );

        const finalState = store.getState();

        res.send(renderFullPage(html, finalState));
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username,
          password = req.body.password;
    User.findOne({name: username, password: password}, (err, user) => {
       if(err) console.log('DB error');
       else{
           if(user){
               req.session.username = user.name;
               res.send({username: user.name});
           } else{
               res.send({error: 'Wrong user data'});
           }
       }
    });
});

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
        <script src="js/bundle.js"></script>
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