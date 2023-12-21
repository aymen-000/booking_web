import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({})
export function UserContextProvider({children}){
    const [user , setUser]=useState(null)
    const [exist , setExist] = useState(false)
    useEffect (()=>{
        if (!user) {
            axios.get('/profile').then((result)=>{
                setUser(result.data)
                setExist(true)
                
            }).catch((err)=>{
                console.log(err.message)
            })
        }
    }, [])
    console.log(children)
    return <UserContext.Provider value={{user,setUser, exist, setExist}}>{children}</UserContext.Provider>
}