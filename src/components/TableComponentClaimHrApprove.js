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

export default function TableComponentClaimHrApprove({ data, rowPerPage }) {
    const [date, setDate] = useState(new Date());
    const [page, setPage] = useState(1);    
    const [hrClaims, setHrClaims] = useState([]);
    const { slice, range } = TableUtil(hrClaims, page, rowPerPage);
    const [selectedHrClaims, setSelectedHrClaims] = useState([]);
    const [isAllSeleted, setIsAllSeleted] = useState(false);
    const [selectedHrClaimRecords, setSelectedHrClaimRecords] = useState([]);
    const clientList = data.clientData;
    const claimTypes = data.claimType;
    const action = data.actionType;

    const auth = useAuth();
    const [emp, setEmp] = useState(auth.user);

    const selectAllClaims = () => {
        if (!isAllSeleted) {
            hrClaims.forEach(element => {
                setSelectedHrClaims(prevSeletedHrClaims => [...prevSeletedHrClaims, element.claimId]);
                setSelectedHrClaimRecords(prevSelectedHrClaimRecords => [...prevSelectedHrClaimRecords, element]);
            });
           // setSelectedHrClaimRecords([...claims]);
        }
        else {
            setSelectedHrClaims([])
            setSelectedHrClaimRecords([]);
        }
        setIsAllSeleted(!isAllSeleted);
    }

    const handleClaimSelect = (claim) => {
        if (selectedHrClaims.includes(claim.claimId)) {
            setSelectedHrClaims(preSelectedHrClaims => preSelectedHrClaims.filter(id => id !== claim.claimId));
            setSelectedHrClaimRecords(prevSelectedHrClaimRecords => prevSelectedHrClaimRecords.filter(
                preClaim => preClaim.claimId !== claim.claimId));
        } else {
            setSelectedHrClaims(preSelectedHrClaims => [...preSelectedHrClaims, claim.claimId]);
            setSelectedHrClaimRecords(prevSelectedHrClaimRecords => [...prevSelectedHrClaimRecords, claim]);
        }        
    }

    const isCalimSelected = (claim) => {
        return selectedHrClaims.includes(claim.claimId);
    }

    const isAllCalimsSelected = () => {
        return selectedHrClaims.length = hrClaims.length;
    }

    const onChangeInput = (key, event) => {
        const { name, value } = event.target;

        const tempRec = selectedHrClaimRecords[key];
        tempRec[name] = value;
        const updatedRec = [];
        updatedRec.push(tempRec);
        setSelectedHrClaimRecords(updatedRec);  
    }

    const onfileUpload = (key, event) => {
        const { name, value } = event.target;
        selectedHrClaimRecords(prevSelectedHrClaimRecords => prevSelectedHrClaimRecords.forEach(
            preCalimRec => {
                if (preCalimRec.id === key) {
                    preCalimRec[name] = value;
                }
            }
        ));
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
            setHrClaims(data);
            //setSelectedHrClaimRecords([]);
            //setSelectedHrClaims([]);
        }
        catch (error) {
            console.log('Error fetching calims:', error);
        }
    };

    const saveClaimRecord = async () => {
        try {
            const claimRecords = selectedHrClaimRecords;
            
            ClaimServices.approveHrClaims(claimRecords).then(async (res) => {
                if (res) {
                   
                    const newRes = await ClaimServices.getApproverClaims(emp.employeeId)
                    const data = await newRes.json();
                    console.log(data);
                    setHrClaims(data);
                    setSelectedHrClaimRecords([]);
                    setSelectedHrClaims([]);
                    alert("Claims are Settled successfully");
                }
            })
        } catch (error) {
            console.log("error adding claim:" + error);
        }
    }; 

       return (
        <div>
            <div style={{ display: "flex", float: "right" }}>
                <input className='center' type='submit' value="Paid" onClick={()=>saveClaimRecord()}></input>
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
                        <th className='tableHeader'>Data of Approval</th>
                        <th className='tableHeader'>Employee Name</th>
                        <th className='tableHeader'>Amount Claimed</th>
                        <th className='tableHeader'>Approved Amount</th>
                        <th className='tableHeader'>Balance Amount</th>
                 
                
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
                                    onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='claimDate'
                                    value={claim.claimDate}
                                    onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='employeeId'
                                    value={claim.employeeId}
                                    onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='totalAmount'
                                    value={claim.totalAmount}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='approvedAmount'
                                    value={claim.approvedAmount}
                                    onChange={(e) => onChangeInput(index, e)}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                           
                            <td className='tableCell'>
                                <input
                                    name='balanceAmount'
                                    value={claim.balanceAmount}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            
                            
                           
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            <PageNation range={range} slice={slice} setPage={setPage} page={page}></PageNation>
        </div>
    );
}
