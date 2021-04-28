import React, {useContext, useEffect, useState} from 'react'

export const appContext = React.createContext(null)

const store = {
  state: undefined,
  reducer: undefined,
  setState: (newState) => {
    store.state = newState
    store.listeners.map(fn => fn(store.state))
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
  store.state = initialState
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
    const {state, setState, subscribe} = useContext(appContext)
    const [, update] = useState({})
    const data = StateSelector ? StateSelector(state) : {state}
    const dispatcher = dispatcherSelector ? dispatcherSelector(dispatch) : {dispatch}
    useEffect(() => {
      return subscribe(() => {
        const newData = StateSelector ? StateSelector(store.state) : {state: store.state}
        if (changed(data, newData)) {
          update({})
        }
      })
    }, [StateSelector])
    return <Component {...props} {...data} {...dispatcher} />
  }
}
