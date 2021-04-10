import React, {useState, useContext} from 'react'

const appContext = React.createContext(null)
export const App = () => {
  const [appState, setAppState] = useState({
    user: {name: 'frank', age: 18}
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </appContext.Provider>
  )
}
const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子 <UserModifier/></section>
const 幺儿子 = () => <section>幺儿子</section>
const User = () => {
  const contextValue = useContext(appContext)
  return <div>User:{contextValue.appState.user.name}</div>
}

const reducer = (state,{type,payload})=>{
  if(type === 'updateUser'){
    return {
      ...state,
      user:{
        ...state.user,
        ...payload
      }
    }
  }else{
    return state
  }
}

const connect = (Compenent)=>{
  return (props)=>{
    const {appState, setAppState} = useContext(appContext)
    const dispach = (action)=>{
      setAppState(reducer(appState,action))
    }
    return <Compenent {...props} dispach={dispach} appState={appState} />
  }
}
const _UserModifier = ({dispach,appState}) => {
  const onChange = (e) => {
    dispach({type:'updateUser',payload:{name:e.target.value}})
  }
  return <div>
    <input value={appState.user.name}
      onChange={onChange}/>
  </div>
}
const UserModifier = connect(_UserModifier)

