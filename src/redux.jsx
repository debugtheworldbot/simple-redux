import React, {useContext, useEffect, useState} from 'react'

const appContext = React.createContext(null)

export const Provider = ({store, children}) => {
  return (
    <appContext.Provider value={store}>
      {children}
    </appContext.Provider>)
}
let state
let reducer
let listeners = []
const setState = (newState) => {
  state = newState
  listeners.map(fn => fn(state))
}

const store = {
  getState: () => state,
  dispatch: (action) => {
    setState(reducer(state, action))
  },
  subscribe: (fn) => {
    listeners.push(fn)
    return () => {
      const newList = listeners.filter(f => JSON.stringify(f) !== JSON.stringify(fn))
      listeners = newList
    }
  }
}
let dispatch = store.dispatch
const preDispatch = dispatch
dispatch = (action) => {
  if (action instanceof Function) {
    return action(dispatch)
  } else {
    preDispatch(action)
  }
}

const preDispatch2 = dispatch
dispatch = (action) => {
  if (action.payload instanceof Promise) {
    action.payload.then(res=>dispatch({...action,payload:res}))
  } else {
    preDispatch2(action)
  }
}


export const createStore = (_reducer, initialState) => {
  state = initialState
  reducer = _reducer
  return store
}

const changed = (one, two) => {
  for (let k in one) {
    if (one[k] !== two[k]) {
      return true
    }
  }
  return false
}

export const connect = (StateSelector, dispatcherSelector) => (Component) => {
  return (props) => {
    const {subscribe} = useContext(appContext)
    const [, update] = useState({})
    const data = StateSelector ? StateSelector(state) : {state}
    const dispatcher = dispatcherSelector ? dispatcherSelector(dispatch) : {dispatch}
    useEffect(() => {
      return subscribe(() => {
        const newData = StateSelector ? StateSelector(state) : {state}
        if (changed(data, newData)) {
          update({})
        }
      })
    }, [StateSelector])
    return <Component {...props} {...data} {...dispatcher} />
  }
}

