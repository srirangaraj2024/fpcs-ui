import axios from 'axios';

//const EMPLOYEE_API_BASE_URL = "http://fpcsdemo.ap-south-1.elasticbeanstalk.com/fpcs/leaves/userLeavesList?userId=abc123";
const EMPLOYEE_API_BASE_URL = "http://localhost:5000/fpcs/employee/getEmpList";
const CLAIM_API_BASE_URL = "http://localhost:5000/fpcs/claims/preClaimFund";
class EmployeeService {

    getEmployees(){
        return axios.get(EMPLOYEE_API_BASE_URL);
    }

    addClaimAdvance(claimAdvance){
        alert("emp data "+claimAdvance.employeeId)
        //return axios.post(CLAIM_API_BASE_URL, claimAdvances);
        return axios.post(CLAIM_API_BASE_URL, claimAdvance);
    }

    
}

export default new EmployeeService()