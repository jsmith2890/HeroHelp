import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import hero from './heroes';
import user from './user';
import citizen from './citizens';

const reducer = combineReducers({
  hero,
  user,
  citizen,
});

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true })),
);
const store = createStore(reducer, middleware);

export default store;
export * from './heroes';
export * from './user';
export * from './citizens';
