import React, {useContext, useEffect, useState} from 'react'

const appContext = React.createContext(null)

export const Provider = ({store, children}) => {
  return (
    <appContext.Provider value={store}>
      {children}
    </appContext.Provider>)
}
let state

const store = {
  getState:()=>state,
  reducer: undefined,
  setState: (newState) => {
    state = newState
    store.listeners.map(fn => fn(state))
  },
  listeners: [],
  subscribe: (fn) => {
    store.listeners.push(fn)
    return () => {
      const newList = store.listeners.filter(f => JSON.stringify(f) !== JSON.stringify(fn))
      store.listeners = newList
    }
  }
}

export const createStore = (reducer, initialState) => {
  state = initialState
  store.reducer = reducer
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
    const dispatch = (action) => {
      setState(store.reducer(state, action))
    }
    const {setState, subscribe} = useContext(appContext)
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

