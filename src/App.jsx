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

const User = connect()(({ state }) => {
  console.log('user')
  return <div>User:{state.user.name}</div>
})

const _UserModifier = ({ updateUser, state }) => {
  console.log('usermocidifer');
  const onChange = (e) => {
    updateUser({ name: e.target.value })
  }
  return <div>
    <input value={state.user.name}
      onChange={onChange} />
  </div>
}
const UserModifier = connect(null, (dispatch) => {
  return {
    updateUser: (attrs) => dispatch({ type: 'updateUser', payload: attrs })
  }
})(_UserModifier)

