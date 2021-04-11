import React, {useState, useContext, useEffect} from 'react'

const appContext = React.createContext(null)
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


const store = {
  state:{
    user: {name: 'frank', age: 18}
  },
  setState:(newState)=>{
    store.state = newState
    store.linsteners.map(fn=>fn(store.state))
  },
  linsteners:[],
  subscribe:(fn)=>{
    store.linsteners.push(fn)
    return ()=>{
      const newList = store.linsteners.filter(f=>JSON.stringify(f)!==JSON.stringify(fn))
      store.linsteners = newList
    }
  }
}

const connect = (Compenent)=>{
  return (props)=>{
    const {state, setState,subscribe} = useContext(appContext)
    const [,update] = useState({})
    const dispach = (action)=>{
      setState(reducer(state,action))
    }
    useEffect(()=>{
      subscribe(()=>update({}))
    },[])
    return <Compenent {...props} dispach={dispach} state={state} />
  }
}

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

