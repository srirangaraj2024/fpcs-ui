import React, {useState} from 'react'
import EmployeeServices from '../services/EmployeeServices';
import { useAuth } from '../components/Auth';
import { useNavigate } from 'react-router-dom';
import { AlertMessage } from '../components/AlertMessage';


export const LoginComponent = () => {
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [empData, setEmpData]= useState([]);
    const auth = useAuth();
    const navigator = useNavigate();

    const handleSubmitEvent = async (event) => {
        event.preventDefault();
        if (userName !== '' && password !== '') {
             try {
                // const response =  EmployeeServices.getEmployeeById(this.state.username);            

                // if(data){
                //  }
                // else{
                //     this.setState(()=> ({errorMessage: 'invalid user'}));
                // }
               // alert(userName);
                const response = await EmployeeServices.getEmployeeByIdAndEmployeeKey(userName,password);
                      const data = await response.data;
                              
                if(data.employeeId==null){
                    setErrorMessage("invalid user id or password");
                    navigator("/")
                }else{
                    auth.login(data);
                    auth.userSelected(data.employeeName);
                    //setEmpData(data);
                navigator("/claims");
                }

            } catch (error) {
                setErrorMessage("Unable to communicate with API" + error);
            }
        } else {
            setErrorMessage("User Name/Password is blank");
        }
    }

    return (
        <>
            <div className='container'>
                <div style={{ width: "50%" }}>
                    <img src={require('../logo.svg').default} alt='logo' />

                </div>
                <div style={{ width: "40%" }}>
                    <AlertMessage errorMessage={errorMessage}></AlertMessage>
                    <h2> LOGIN TO FPCS</h2>
                    <br></br>
                    <form onSubmit={handleSubmitEvent}>
                    
                        <label><b>Login  ID</b></label>
                        <input type="text" style={{width:"75%"}} onChange={(e) => setUserName(e.target.value)}
                            value={userName} placeholder='Login Id' /><br />
                             <label><b>Password</b></label>
                        <input type="password" style={{width:"75%"}}  onChange={(e) => setPassword(e.target.value)}
                            value={password} placeholder='password' /> <br />
                        <input style={{width:"25%"}} type="submit" value="Login"></input>
                    </form>
                </div>

            </div>
        </>

    )
}
