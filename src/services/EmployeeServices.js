import axios from 'axios';

//const EMPLOYEE_API_BASE_URL = "http://fpcsdemo.ap-south-1.elasticbeanstalk.com/fpcs/leaves/userLeavesList?userId=abc123";
const EMPLOYEE_API_BASE_URL = "http://fpcsdev.ap-southeast-1.elasticbeanstalk.com/fpcs/employee/getEmpList";
const CLAIM_API_BASE_URL = "http://fpcsdev.ap-southeast-1.elasticbeanstalk.com/fpcs/claims/preClaimFund";
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