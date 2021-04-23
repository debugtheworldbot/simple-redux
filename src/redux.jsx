import React, { useState, useContext, useEffect } from 'react'

export const appContext = React.createContext(null)

export const store = {
  state: {
    user: { name: 'frank', age: 18 },
    team: { name: 'A-team' }
  },
  setState: (newState) => {
    store.state = newState
    store.linsteners.map(fn => fn(store.state))
  },
  linsteners: [],
  subscribe: (fn) => {
    store.linsteners.push(fn)
    return () => {
      const newList = store.linsteners.filter(f => JSON.stringify(f) !== JSON.stringify(fn))
      store.linsteners = newList
    }
  }
}

const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}

const changed = (one, two) => {
  let change = false
  for (let k in one) {
    if (one[k] !== two[k]) {
      change = true
    }
  }
  return change
}

export const connect = (selector) => (Compenent) => {
  return (props) => {
    const { state, setState, subscribe } = useContext(appContext)
    const [, update] = useState({})
    const data = selector ? selector(state) : { state }
    const dispach = (action) => {
      setState(reducer(state, action))
    }
    useEffect(() => {
      const clean = store.subscribe(() => {
        const newData = selector ? selector(store.state) : { state: store.state }
        if (changed(data, newData)) {
          update({})
        }
      })
      return clean
    }, [selector])
    return <Compenent {...props} {...data} dispach={dispach} />
  }
}
