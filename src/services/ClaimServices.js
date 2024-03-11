import axios from "axios";
const DEV_URL="http://fpcsdev.ap-southeast-1.elasticbeanstalk.com";
//const DEV_URL="http://localhost:5000";
const CLAIM_API_BASE_URL = DEV_URL+"/fpcs/claims/getSavedClaims";
const CLEINT_API_URL=DEV_URL+"/fpcs/masterdata/getClientMasterData";
const SAVE_CLAIM_URL=DEV_URL+"/fpcs/claims/saveClaimRequest";
const GET_APROVER_CLAIM_URL=DEV_URL+"/fpcs/claims/getApproverClaims";
const SUBMIT_CLAIM_URL=DEV_URL+"/fpcs/claims/submitClaimRequest"
const SAVE_CLAIM_ATTACHMENT_URL=DEV_URL+"/fpcs/claims/uploadClaimProof";
const DOWNLOAD_CLAIM_ATTACHMENT_URL=DEV_URL+ "/fpcs/claims/downloadClaimProof";
const DELETE_CLAIM_URL = DEV_URL + "/fpcs/claims/deleteClaimRequest"
const APPROVE_LEAD_CLAIM_URL = DEV_URL + "/fpcs/claims/approveClaimRequest"
const REJECT_LEAD_CLAIM_URL = DEV_URL + "/fpcs/claims/rejectClaimRequest";
class ClaimServices{
  
  getClaims(userName) {
    return fetch(CLAIM_API_BASE_URL+"?employeeId="+userName);
    //return fetch(CLAIM_API_BASE_URL);
  }

  getApproverClaims(userName) {
    return fetch(GET_APROVER_CLAIM_URL+"?employeeId="+userName);
    //return fetch(CLAIM_API_BASE_URL);
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

  deleteClaims(claims){
    return axios.post(DELETE_CLAIM_URL, claims);
  }

  submitClaims(claims) {
    return axios.post(SUBMIT_CLAIM_URL, claims);
  }

  approveLeadClaims(claims){
    return axios.put(APPROVE_LEAD_CLAIM_URL, claims);
  }
  approveHrClaims(claims){
    return axios.put(APPROVE_LEAD_CLAIM_URL, claims);
  }
  rejectClaims(claims){
    return axios.put(REJECT_LEAD_CLAIM_URL, claims);
  }
  REJECT_LEAD_CLAIM_URL
  downloadFile(filePath){
    // filePath='0308112136_ClientMasterData.xlsx'
    return axios.get(DOWNLOAD_CLAIM_ATTACHMENT_URL+"?attachProof="+encodeURIComponent(filePath))
  }
}
export default new ClaimServices();

