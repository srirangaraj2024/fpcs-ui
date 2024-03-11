import axios from 'axios';
//const DEV_URL="http://localhost:5000";
const DEV_URL="http://fpcsdev.ap-southeast-1.elasticbeanstalk.com";
//const EMPLOYEE_API_BASE_URL = "http://fpcsdemo.ap-south-1.elasticbeanstalk.com/fpcs/leaves/userLeavesList?userId=abc123";
const EMPLOYEE_API_BASE_URL = DEV_URL+"/fpcs/employee/getEmpList";
const CLAIM_API_BASE_URL = DEV_URL+"/fpcs/claims/preClaimFund";
const EMP_LOGIN_URL=DEV_URL+"/fpcs/employee/empLogin";
class EmployeeService {

    getEmployees(){
        //return axios.get(EMPLOYEE_API_BASE_URL);
    }

    getEmployeeByIdAndEmployeeKey(employeeId,employeeKey){
        return axios.get(EMP_LOGIN_URL+'?'+'employeeId='+employeeId+'&'+'employeeKey='+employeeKey);
    }

    addClaimAdvance(claimAdvance){
        alert("emp data "+claimAdvance.employeeId)
        //return axios.post(CLAIM_API_BASE_URL, claimAdvances);
        //return axios.post(CLAIM_API_BASE_URL, claimAdvance);
    }

    
}

export default new EmployeeService()