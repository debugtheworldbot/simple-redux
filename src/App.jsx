import React from 'react'
import {connect,appContext,store} from './redux'

export const App = () => {
  console.log('app');
  return (
    <appContext.Provider value={store}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </appContext.Provider>
  )
}

const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子 <UserModifier/></section>
const 幺儿子 = () => <section>幺儿子</section>


const User = connect(({state}) => {
  return <div>User:{state.user.name}</div>
})


const _UserModifier = ({dispach,state}) => {
  console.log('usermocidifer!');
  const onChange = (e) => {
    dispach({type:'updateUser',payload:{name:e.target.value}})
  }
  return <div>
    <input value={state.user.name}
      onChange={onChange}/>
  </div>
}
const UserModifier = connect(_UserModifier)

