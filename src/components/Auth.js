import {createContext, useContext, useState} from "react"

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
const [user, setUser] = useState([]);
const [userName, setUserName]=useState(null);
const [menu, setMenu] = useState("");
const login  = user => {
    alert(user);
    setUser(user);
    //setUserName(user.employeeName);
}
const logOut = () =>{
    setUser(null);
}
const menuSelected = (menu) =>{
    setMenu(menu);
}
const userSelected = (employeeName) =>{
    alert("emp name"+employeeName); 
    setUserName(employeeName);
}
return <AuthContext.Provider value = {{user,menu,userName,login, logOut,userSelected, menuSelected}}>{children}</AuthContext.Provider>
} 
export const useAuth = () =>{
    return useContext(AuthContext);
}