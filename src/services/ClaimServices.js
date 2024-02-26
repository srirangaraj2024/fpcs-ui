import axios from "axios";
const LOCAL_URL="http://localhost:5000";
const DEV_URL="http://fpcsdev.ap-southeast-1.elasticbeanstalk.com";
const CLAIM_API_BASE_URL = DEV_URL+"/fpcs/claims/getSavedClaims?employeeId=emp123";
const CLEINT_API_URL=DEV_URL+"/fpcs/claims/getClientMasterData";
const SAVE_CLAIM_URL=DEV_URL+"/fpcs/claims/saveClaimRequest";
//const SAVE_CLAIM_URL="http://localhost:5000/fpcs/claims/saveClaimRequest"
const SAVE_CLAIM_ATTACHMENT_URL=DEV_URL+"/fpcs/claims/uploadClaimProof"
class ClaimServices{
  
  getClaims(userName) {
 //   return fetch(CLAIM_API_BASE_URL+"?employeeId="+userName);
    return fetch(CLAIM_API_BASE_URL);
  }
  getClientMaster(){
    return fetch(CLEINT_API_URL);
  }
uploadClaimAttachment(file)
{
  const formData = new FormData();
  formData.append(
    "myFile",
    file,
    file.name,
    file.path
);
console.log(file);
return axios.post(SAVE_CLAIM_ATTACHMENT_URL, formData);
    //return fetch(SAVE_CLAIM_ATTACHMENT_URL, file, {
   //   headers: {
       // "Content-Type": 'multipart/form-data',
     //   mode:'no-cors',
     //   method:'POST'
    //  }
      
    //});
 
}
  createClaim(claim){
    return axios.post(SAVE_CLAIM_URL,claim);
  }

  updateClaim(claim, claimId){
    return axios.put(CLAIM_API_BASE_URL+'/'+claimId, claim)
  }

  getClaimById(claimId){
    return axios.get(CLAIM_API_BASE_URL+'/'+claimId);
  }

  deleteClaim(claimId){
    return axios.delete(CLAIM_API_BASE_URL+'/'+claimId);
  }
  
}
export default new ClaimServices()

