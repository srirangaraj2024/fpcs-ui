import React, { useEffect, useState } from 'react'
import { element } from 'prop-types';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import PageNation from './PageNation';
import {emptyClaim} from '../data/ClaimsData'
import TableUtil from './TableUtils';
import ClaimServices from '../services/ClaimServices';
import { emptyClaims } from '../data/ClaimsData';
import { useAuth } from './Auth';

export default function TableComponentClaimApprove({ data, rowPerPage }) {
    const [date, setDate] = useState(new Date());
    const [page, setPage] = useState(1);
    const [leadClaims, setLeadClaims] = useState([]);
    const { slice, range } = TableUtil(leadClaims, page, rowPerPage);
    const {leadApprovalClaims,setLeadApprovalClaims} = useState([]);
   
    const [selectedLeadClaims, setSelectedLeadClaims] = useState([]);
    const [isAllSeleted, setIsAllSeleted] = useState(false);
    const [selectedLeadClaimRecords, setSelectedLeadClaimRecords] = useState([]);   
    const action = data.actionType;
    const auth = useAuth();
    const [emp, setEmp] = useState(auth.user);

    const selectAllClaims = () => {
        if (!isAllSeleted) {
            leadClaims.forEach(element => {
                setSelectedLeadClaims(prevSeletedLeadClaims => [...prevSeletedLeadClaims, element.claimId]);
                setSelectedLeadClaimRecords(prevSelectedLeadClaimRecords => [...prevSelectedLeadClaimRecords, element]);

            });
        }
        else {
            setSelectedLeadClaims([]);
            setSelectedLeadClaimRecords([]);
        }
        setIsAllSeleted(!isAllSeleted);
    }

    const handleClaimSelect = (claim) => {
        if (selectedLeadClaims.includes(claim.claimId)) {
            setSelectedLeadClaims(preSelectedLeadClaims => preSelectedLeadClaims.filter(id => id !== claim.claimId));
            setSelectedLeadClaimRecords(prevSelectedLeadClaimRecords => prevSelectedLeadClaimRecords.filter(
                preClaim => preClaim.claimId !== claim.claimId));
            
        } else {
            setSelectedLeadClaims(preSelectedLeadClaims => [...preSelectedLeadClaims, claim.claimId]);
            setSelectedLeadClaimRecords(prevSelectedLeadClaimRecords => [...prevSelectedLeadClaimRecords, claim]);            
        }        
    }

    const isCalimSelected = (claim) => {
        return selectedLeadClaims.includes(claim.claimId);
    }

    const isAllCalimsSelected = () => {
        return selectedLeadClaims.length = leadClaims.length;
    }

    const onChangeInput = (key, event) => {
        const { name, value } = event.target;      
        setSelectedLeadClaimRecords(preselectedLeadClaimRecords => 
            preselectedLeadClaimRecords.map(v => {
                if (v.claimId === key) {
                    v[name] = value;
                }
                return v;
            })
        );
        //const tempRec = selectedLeadClaimRecords[key];
       // tempRec[name] = value;
       // const updatedRec = [];
       // updatedRec.push(tempRec);
       // setSelectedLeadClaimRecords(updatedRec);        
    }
    
    useEffect(() => {
        fetchCalims().then(() => {
            console.log("claim data fetched successfully");
        });
    }, []);

    const fetchCalims = async () => {
        try {
            const response = await ClaimServices.getApproverClaims(emp.employeeId);
            const data = await response.json();
            setLeadClaims(data);

           /// setSelectedLeadClaimRecords([]);
           // setSelectedLeadClaims([]);
        }
        catch (error) {
            console.log('Error fetching calims:', error);
        }
    };

    const saveClaimRecord = async () => {
        try {
            const claimRecords = selectedLeadClaimRecords;
            ClaimServices.approveLeadClaims(claimRecords).then(async (res) => {
                if (res) {
                    const newRes = await ClaimServices.getApproverClaims(emp.employeeId)
                    const data = await newRes.json();
                    setLeadClaims(data);
                    setSelectedLeadClaimRecords([]);
                    setSelectedLeadClaims([]);
                    alert("Claims are Approved successfully");
                }
            })


        } catch (error) {
            console.log("error adding claim:" + error);
        }
    };       
    const rejectClaimRecord = async () => {
        try {
            const claimRecords = selectedLeadClaimRecords;
            ClaimServices.rejectClaims(claimRecords).then(async (res) => {
                if (res) {
                    const newRes = await ClaimServices.getApproverClaims(emp.employeeId)
                    const data = await newRes.json();
                    setLeadClaims(data);
                    setSelectedLeadClaimRecords([]);
                    setSelectedLeadClaims([]);
                    alert("Claims are Rejected successfully");
                }
            })


        } catch (error) {
            console.log("error adding claim:" + error);
        }
    };   
    const downLoadFiles = (claimId) =>{

    }

    return (
        <div>
            <div style={{ display: "flex", float: "right" }}>
                <input className='right' type='submit' value="Approve" onClick={()=>saveClaimRecord()}></input>
                <input className='right' type='submit' value="Reject" onClick={()=>rejectClaimRecord()}></input>
                {/* <input className='right' type='submit' value="Submit" onClick={updateClaimRecord}></input>  
      <input className='right' type='submit' value="Delete" onClick={deleteClaimRecord}></input>   */}
            </div>
            <br></br>
            <label><b>Pernding Approvals</b></label><br></br>
            <table className='table'>
                <thead className='tableRowHeader'>
                    <tr>
                        <th className='tableHeader'>
                            <input type='checkbox' checked={isAllSeleted?true:false} onChange={() =>selectAllClaims()} />
                        </th>
                        <th className='tableHeader'>Claim No#</th>
                        <th className='tableHeader'>Date of Claim</th>
                        <th className='tableHeader'>Employee Name</th>
                        <th className='tableHeader'>Amount Claimed</th>
                        <th className='tableHeader'>Amount Approved</th>
                        <th className='tableHeader'>Billable</th>
                       
                        <th className='tableHeader'>Balance</th>
                        <th className='tableHeader'>Claim Status</th>
                        <th className='tableHeader'>Comments</th>
                        <th className='tableHeader'>Attachments</th>
                    </tr>
                </thead>
                <tbody>
                    {slice.map((claim, index) => (
                        <tr className='tableRowItems' key={claim.claimId}>
                            <td className='tableCell'>
                                <input
                                    type='checkbox'
                                     checked={isCalimSelected(claim)?true:false}
                                    onChange={() => handleClaimSelect(claim)}
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='claimId'
                                    value={claim.claimId}
                                    //onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='claimDate'
                                    value={claim.claimDate}
                                    //onChange={(e) => onChangeInput(index, e)}
                                    placeholder='enter Date'
                                    type='text'
                                    disabled='true'
                                    style={{width: "150px"}}
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='employeeId'
                                    value={claim.employeeId}
                                   // onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                    style={{ width: "150px" }}
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='totalAmount'
                                    value={claim.totalAmount}
                                   // onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                    style={{ width: "150px" }}
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='approvedAmount'
                                    value={claim.approvedAmount}
                                    onChange={(e) => onChangeInput(claim.claimId, e)}
                                    placeholder=''
                                    type='text'
                                    disabled={isCalimSelected(claim) ? false : true}
                                    style={{ width: "150px" }}
                                />
                            </td>
                            <td className='tableCell'>
                                <select
                                    name='isBillable'
                                    value={claim.isBillable}
                                    onChange={(e) => onChangeInput(claim.claimId, e)}
                                    disabled={isCalimSelected(claim) ? false : true}
                                    style={{ width: "100px" }}>
                                    <option value='Yes'>Yes</option>
                                    <option value='No'>No</option>
                                </select>
                            </td>                            
                           
                            <td className='tableCell'>
                                <input
                                    name='balanceAmount'
                                    value={claim.balanceAmount}
                                  //  onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                    style={{ width: "150px" }}
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='claimStatus'
                                    value={claim.claimStatus}
                                   // onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                    style={{ width: "150px" }}
                                />
                            </td>
                            <td className='tableCell'>
                                <textarea
                                    name='claimComments'
                                    value={claim.claimComments}
                                    onChange={(e) => onChangeInput(claim.claimId, e)}
                                    placeholder='Enter comments'
                                    type='false'
                                    style={{ width: "250px" }}
                                    maxLength="2500"
                                    rows='3'
                                />
                            </td>
                            <td className='tableCell'>
                                <input className='right' name='attachments' type='submit' value="Download" onClick={downLoadFiles}></input>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PageNation range={range} slice={slice} setPage={setPage} page={page}></PageNation>
        </div>
    );
}
