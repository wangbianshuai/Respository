import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import reducers from '../reducers/Index'

const logger = store => next => action => {
    if (typeof action === 'function') console.log('dispatching a function')
    else console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}

const middlewares = [logger, thunk]

const createAppStore = applyMiddleware(...middlewares)(createStore)

export default function configureStore(onComplete = () => void (0)) {
    const store = autoRehydrate()(createAppStore)(reducers)
    persistStore(store, {}, onComplete)
    return store
}