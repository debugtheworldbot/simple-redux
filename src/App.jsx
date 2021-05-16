import React from 'react'
import {connect, createStore, Provider} from './redux'
import {connectToUser} from './connectors/connectToUser'

const reducer = (state, {type, payload}) => {
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

const initState = {
  user: {name: 'frank', age: 18},
  team: {name: 'A-team'}
}
const store = createStore(reducer, initState)

export const App = () => {
  console.log('app');
  return (
    <Provider store={store}>
      <Grandfather />
      <Father />
      <Son />
    </Provider>
  )
}

const Grandfather = () => {
  console.log('grandfather')
  return (<section>Grandfather<User /></section>)
}
const Father = () => {
  console.log('father')
  return (<section>father <UserModifier /></section>)
}
const Son = connect(state => {
  return {team: state.team}
})(({team}) => {
  console.log('son')
  return (<section>son team:{team.name}</section>)
})

const User = connectToUser(({user}) => {
  console.log('user')
  return <div>User:{user.name}</div>
})

const ajax = (url) => new Promise((resolve) => {
  setTimeout(() => {
    resolve('new user');
  }, 1000)
})

const fetch = (dispatch) => {
  ajax('/user').then(res => dispatch({type: 'updateUser', payload: {name: store.getState().user.name + res}}))
}
const UserModifier = connect(null, null)(({dispatch, state}) => {
  console.log('userModifier');
  const {name} = state.user
  const onChange = (e) => {
    dispatch({type: 'updateUser', payload: {name: e.target.value}})
  }
  const onClick=()=> {
    dispatch({type: 'updateUser', payload:ajax('/user').then(res =>{return {name:store.getState().user.name+res}})})
    // dispatch(fetch)
  }
  return <div>
    <input value={name}
           onChange={onChange} />
    <button onClick={onClick}>fetch user</button>
  </div>
})

