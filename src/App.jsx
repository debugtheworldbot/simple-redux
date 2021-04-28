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

const _UserModifier = ({updateUser, user}) => {
  console.log('usermocidifer');
  const onChange = (e) => {
    updateUser({name: e.target.value})
  }
  return <div>
    <input value={user.name}
           onChange={onChange} />
  </div>
}
const UserModifier = connectToUser(_UserModifier)

