import React from 'react'
import { connect, appContext, store } from './redux'

export const App = () => {
  console.log('app');
  return (
    <appContext.Provider value={store}>
      <Grandfather />
      <Father />
      <Son />
    </appContext.Provider>
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
  return { team: state.team }
})(({ team }) => {
  console.log('son')
  return (<section>son team:{team.name}</section>)
})

const userSelector = state => {
  return { user: state.user }
}
const userDispatch = (dispatch) => {
  return {
    updateUser: (attrs) => dispatch({ type: 'updateUser', payload: attrs })
  }
}
const connectToUser = connect(userSelector, userDispatch)

const User = connectToUser(({ user }) => {
  console.log('user')
  return <div>User:{user.name}</div>
})

const _UserModifier = ({ updateUser, user }) => {
  console.log('usermocidifer');
  const onChange = (e) => {
    updateUser({ name: e.target.value })
  }
  return <div>
    <input value={user.name}
      onChange={onChange} />
  </div>
}
const UserModifier = connectToUser(_UserModifier)

