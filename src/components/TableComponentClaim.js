import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { element } from 'prop-types';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import PageNation from './PageNation';
import TableUtil from './TableUtils';
import ClaimServices from '../services/ClaimServices';
import { emptyClaims } from '../data/ClaimsData';
import { clientList } from '../data/ClaimsData';
import '../styles/Table.css'
import { useAuth } from './Auth';


export default function TableComponentClaim({ data, rowPerPage }) {
    const [date, setDate] = useState(new Date());
    const [page, setPage] = useState(1);
     const [clientData, setClientData] = useState([]);
    //const [clientData, setClientData] = useState([...clientList]);
    const [claims, setClaims] = useState([]);
    const [claimAttachment, setClaimAttachment] = useState([]);
    const { slice, range } = TableUtil(claims, page, rowPerPage);
    const [selectedClaims, setSelectedClaims] = useState([]);
    const [isAllSeleted, setIsAllSeleted] = useState(false);
    const [file, setFile] = useState("");
    const [selectedClaimRecords, setSelectedClaimRecords] = useState([...emptyClaims]);
    const [isFixedExpenses, setIsFixedExpenses] = useState(true);
    //const clientList = clientData;
    const claimTypes = data.claimType;
    
    const auth = useAuth();
    const [emp, setEmp] = useState(auth.user);

    const selectAll = () => {
        setSelectedClaims([]);
        setSelectedClaimRecords([]);
        if (!isAllSeleted) {
            claims.forEach(element => {
                if (!element.claimStatus.includes('Submit')){
                    setSelectedClaims(prevSeletedClaims => [...prevSeletedClaims, element.id]);
                    setSelectedClaimRecords(prevSelectedClaimRecords => [...prevSelectedClaimRecords, element])
                }
            });
        }
        else {
            setSelectedClaimRecords([...emptyClaims]);
        }
        setIsAllSeleted(!isAllSeleted);
    }

    const handleClaimSelect = (claim) => {
        if(!claim.claimStatus.includes('Submit')){
            if (selectedClaims.includes(claim.id)) {
                setSelectedClaims(preSelectedClaims => preSelectedClaims.filter(id => id !== claim.id));
                if (selectedClaims.length === 1) {
                    setSelectedClaimRecords([...emptyClaims]);
                } else {
                    setSelectedClaimRecords(prevSelectedClaimRecords => prevSelectedClaimRecords.filter(
                        preClaim => preClaim.id !== claim.id));
                }
            } else {
                setSelectedClaims(preSelectedClaims => [...preSelectedClaims, claim.id]);
                if (selectedClaimRecords.length === 1 && selectedClaimRecords[0].id === '') {
                    const editClaims = [];
                    editClaims.push(claim);
                    setSelectedClaimRecords([...editClaims]);
                } else {
                    setSelectedClaimRecords(prevSelectedClaimRecords => [...prevSelectedClaimRecords, claim]);
                }
            }
        }
        
    }

    const isCalimSelected = (claim) => {
        return (selectedClaims.includes(claim.id) );
    }

    const isAllCalimsSelected = () => {
        return selectedClaims.length === claims.length;
    }

    const onChangeInput = (key, event) => {
        //alert(event.target);
        const { name, value } = event.target;
        //alert(key);
        if (name ==='clientName'){
            const findClientRec = clientData.find((cr) => cr.customerCode===value);
            setIsFixedExpenses(findClientRec !== null && findClientRec.fixedExpenses !== 'NA');           
        const emptyRec = emptyClaims;
            emptyRec[0].fixedExpenses = findClientRec.fixedExpenses;
           
            setSelectedClaimRecords(emptyRec);
        }
        if (name ==='noOfDays'){
            const findClientRec = clientData.find((cr) => cr.customerCode===value);
            //setIsFixedExpenses(findClientRec !== null && findClientRec.fixedExpenses !== 'NA');           
        const emptyRec = emptyClaims;
           // emptyRec[0].fixedExpenses = findClientRec.fixedExpenses;
            emptyRec[0].totalAmount = emptyRec[0].fixedExpenses * value;
           
            setSelectedClaimRecords(emptyRec);
        }
        const tempRec = selectedClaimRecords[key];
        tempRec[name] = value;
        const updatedRec = [];
        updatedRec.push(tempRec);
        // setSelectedClaimRecords(prevSelectedClaimRecords => prevSelectedClaimRecords.forEach(
        //     preCalimRec => {
        //         if (preCalimRec.id === key) {
        //             preCalimRec[name] = value;
        //         }
        //     }
        // ));
        setSelectedClaimRecords(updatedRec);

    }

    const onfileUpload = (key, event) => {
        const { name, value } = event.target;
        selectedClaimRecords(prevSelectedClaimRecords => prevSelectedClaimRecords.forEach(
            preCalimRec => {
                if (preCalimRec.id === key) {
                    preCalimRec[name] = value;
                }
            }
        ));
    }        


    useEffect(() => {
        fetchCalims().then(() => {
            const emptyRec = emptyClaims;
            emptyRec[0].employeeName = emp.employeeId;
            emptyRec[0].balanceAmount = emp.balanceAmount;
            setSelectedClaimRecords(emptyRec);
    
            
            console.log("claim data fetched successfully");
        });
    }, []);

    const fetchCalims = async () => {
        try {
                 const cliamResponse = await ClaimServices.getClaims(emp.employeeId);
                 const data = await cliamResponse.json();
                 setClaims(data);

                 const clientresponse= await ClaimServices.getClientMaster();
                 const clientData= await clientresponse.json();
                 clientData[0]="select";
                 setClientData(clientData);  
                   
            
        }
        catch (error) {
            console.log('Error fetching calims:', error);
        }
    };

    const saveClaimRecord = (claimRecord) => {
        
        addClaimRecord(selectedClaimRecords[0]).then(() => {
            console.log('Claim Added successfully');
        });
        if (claimRecord.id !== '') {
            updateClaimRecord(claimRecord).then(() => {
                console.log('Claim updated successfully');

            });

        } else {
            addClaimRecord(claimRecord).then(() => {
                console.log('Claim Added successfully');
            });
        }

    };
    const addClaimRecord = async (claimRecord) => {
        try {
            claimRecord.employeeId=emp.employeeId;
            claimRecord.attachProof=file;
            const response = await ClaimServices.createClaim(claimRecord);
            const data = await response.json();
            setClaims([...claims, data]);
        } catch (error) {
            console.log("error adding claim:" + error);
        }

    };
const downloadFile=(fileLocation)=>{
window.open(fileLocation);
}


const uploadFile =async(index,e) => {
    try {
        const attachment=e.target.files[0];
        
      console.log(attachment)
     const formData = new FormData();
  formData.append("claimAttachment", attachment);
  formData.append("employeeId",emp.employeeId)
 await axios.post('http://localhost:5000/fpcs/claims/uploadClaimProof',formData,
  {   headers :{
    method:"POST",
    "Custom-header":"value",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Credentials": 'true',
   " Access-Control-Allow" : "true"
  } }).then(res => {
            console.log(res.data);
            setFile(res.data)
            alert("File uploaded successfully.")
    
    }).catch((error)=>{
                    console.log("errpr"+error)})
    } catch (error) {
        console.log("error adding claim:" + error);
    }
}
    const updateClaimRecord = async (selectedClaimRecords) => {
        try {
            const claimRecord = selectedClaimRecords[0];
            const response = await ClaimServices.updateClaim(claimRecord, claimRecord.claimId);
            const updatedClaim = await response.json;
            const updatedClaims = claims.map(claim => claim.claimId === updatedClaim.claimId ? updatedClaim : claim);
            setClaims(updatedClaims);
            setSelectedClaimRecords([...emptyClaims]);
        } catch (error) {
            console.log("error adding claim:" + error);
        }
    };

    const deleteClaimRecord = async (claimId) => {
        try {
            await ClaimServices.deleteClaim(claimId);
            const updatedClaims = claims.filter((claim) => claim.id !== claimId);
            setClaims(updatedClaims);
            setSelectedClaimRecords([...emptyClaims]);
        } catch (error) {
            console.log("error delteting claim:" + error);
        }

    }
    return (
        <div>
            <div style={{ display: "flex", float: "right" }}>
                <input className='right' type='submit' value="Save" onClick={saveClaimRecord}></input>
                <input className='right' type='submit' value="Submit" onClick={updateClaimRecord}></input>
                <input className='right' type='submit' value="Delete" onClick={deleteClaimRecord}></input>
            </div>
            <table className='table'>
                <thead>
                    <tr>
                    <th className='tableHeader'>Claim No#</th>
                        <th className='tableHeader'>Date of Claim</th>
                        <th className='tableHeader'>Employee Name</th>
                        <th className='tableHeader'>Type of Claim</th>
                        <th className='tableHeader'>Client Name</th>
                        <th className='tableHeader'>From Date</th>
                        <th className='tableHeader'>To Date</th>
                        <th className='tableHeader'>From Place</th>
                        <th className='tableHeader'>To Place</th>
                        <th className='tableHeader'>Fixed Expn</th>
                        <th className='tableHeader'>No. days</th>
                        <th className='tableHeader'>Total Amount</th>

                        <th className='tableHeader'>Variable Amount</th>
                        <th className='tableHeader'>Billable</th>
                        <th className='tableHeader'>Balance Amount</th>
                        <th className='tableHeader'>Comments</th>
                     
                        <th className='tableHeader'>Attachments</th>
                        
                       
                    </tr>
                </thead>
                <tbody>
                    {
                        selectedClaimRecords.map((claimRec, index )=> (
                            <tr key={claimRec.id}>
                                <td className='tableCell'>
                                    <input
                                        name='id'
                                        value={claimRec.id}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                        style={{ width: "50px"}}
                                       
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='claimDate'
                                        value={claimRec.claimDate}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='enter Date'
                                        type='text'
                                        style={{width: "120px"}}                                        
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='employeeName'
                                        value={claimRec.employeeName}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                        style={{ width: "150px" }}
                                        disabled='true'
                                    />
                                </td>
                                <td className='tableCell'>
                                    <select
                                        value={claimRec.claimType}
                                        name='claimType'
                                        
                                        onChange={(e) => onChangeInput(index,e)}
                                        style={{ width: "100px" }}
                                        >
                                        {claimTypes.map(claimType =>
                                            <option value={claimType}>{claimType}</option>
                                        )};
                                    </select>
                                </td>
                                <td className='tableCell'>
                                    <select
                                        value={claimRec.clientName}
                                        name='clientName'
                                        onChange={(e) => onChangeInput(index,e)}
                                        style={{ width: "100px" }}>
                                            
                                        {clientData.map(clientType =>
                                            <option value={clientType.customerCode}>{clientType.customerCode}</option>
                                        )};
                                    </select>
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='fromDate'
                                        value={claimRec.fromDate}
                                        onChange={(e) => onChangeInput(index, e)}
                                        placeholder='Enter date'
                                        type='date'
                                        style={{ width: "150px" }}
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='toDate'
                                        value={claimRec.toDate}
                                        onChange={(e) => onChangeInput(index, e)}
                                        placeholder='Enter date'
                                        type='date'
                                        style={{ width: "150px" }}
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='fromPlace'
                                        value={claimRec.fromPlace}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter Place'
                                        type='text'
                                        style={{ width: "150px" }}
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input 
                                        name='toPlace'
                                        value={claimRec.toPlace}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter place'
                                        type='text'
                                        style={{ width: "150px" }}
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='fixedExpenses'
                                        value={claimRec.fixedExpenses}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                        disabled={!isFixedExpenses}
                                        style={{ width: "100px" }}
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='noOfDays'
                                        value={claimRec.noOfDays}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter Days'
                                        type='text'
                                        style={{ width: "50px" }}
                                        disabled={!isFixedExpenses}
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='totalAmount'
                                        value={claimRec.totalAmount}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                        style={{ width: "100px" }}
                                        disabled='true'
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='variableExpenses'
                                        value={claimRec.variableExpenses}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter Amount'
                                        type='text'
                                        style={{ width: "100px" }}
                                        disabled={isFixedExpenses}
                                    />
                                </td>
                                <td className='tableCell'>
                                    <select
                                        name='isBillable'
                                        value={claimRec.isBillable}
                                        onChange={(e) => onChangeInput(index,e)}
                                        style={{ width: "100px" }}>
                                        <option value='Yes'>Yes</option>
                                        <option value='No'>No</option>
                                    </select>
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='balanceAmount'
                                        value={claimRec.balanceAmount}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                        style={{ width: "150px" }}
                                        disabled='true'
                                    />
                                </td>
                                <td className='tableCell'>
                                    <textarea
                                        name='claimComments'
                                        value={claimRec.claimComments}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter comments'
                                        type='false'
                                        style={{ width: "250px" }}
                                        maxLength="2500"
                                        rows='3'
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='attachProof'
                                       // value={claimRec.attachProof}
                                        onChange={(e) => uploadFile(index,e)}
                                        placeholder=''
                                        type='file'
                                        style={{ width: "200px" }}
                                        disabled={isFixedExpenses}
                                    />
                                   
                                </td>
                                
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <br></br>
            <label><b>My Claims History</b></label><br></br>
            <table className='table'>
                <thead className='tableRowHeader'>
                    <tr>
                        <th className='tableHeader'>
                            <input type='checkbox' checked={isAllCalimsSelected} onChange={selectAll} />
                        </th>
                        <th className='tableHeader'>Claim No#</th>
                        <th className='tableHeader'>Date of Claim</th>
                        <th className='tableHeader'>Employee Name</th>
                        <th className='tableHeader'>Type of Claim</th>
                        <th className='tableHeader'>Client Name</th>
                        <th className='tableHeader'>From Date</th>
                        <th className='tableHeader'>To Date</th>
                        <th className='tableHeader'>From Place</th>
                        <th className='tableHeader'>To Place</th>
                        <th className='tableHeader'>Fixed Expn</th>
                        <th className='tableHeader'>No. days</th>
                        <th className='tableHeader'>Total Amount</th>
                        <th className='tableHeader'>Variable Amount</th>
                        <th className='tableHeader'>Billable</th>
                        <th className='tableHeader'>Balance Amount</th>
                        <th className='tableHeader'>Comments</th>
                        <th className='tableHeader'>claimStatus</th>
                        <th className='tableHeader'>Attachments</th>
                        <th className='tableHeader'>Update</th>
                    </tr>
                </thead>
                <tbody>
                    {slice.map((claim) => (
                        <tr className='tableRowItems' key={claim.id}>
                            <td className='tableCell'>
                                <input
                                    type='checkbox'
                                    checked={isCalimSelected(claim)}
                                    onChange={() => handleClaimSelect(claim)}
                                    disabled={claim.claimStatus.includes('Submit')}
                                />
                            </td>
                            <td className='tableCell'>{claim.claimId}</td>
                            <td className='tableCell'>{claim.claimDate}</td>
                            <td className='tableCell'>{claim.employeeId}</td>
                            <td className='tableCell'>{claim.claimType}</td>
                            <td className='tableCell'>{claim.clientName}</td>
                            <td className='tableCell'>{claim.fromDate}</td>
                            <td className='tableCell'>{claim.toDate}</td>
                            <td className='tableCell'>{claim.fromPlace}</td>
                            <td className='tableCell'>{claim.toPlace}</td>
                            <td className='tableCell'>{claim.fixedExpenses}</td>
                            <td className='tableCell'>{claim.noOfDays}</td>
                            <td className='tableCell'>{claim.totalAmount}</td>
                            <td className='tableCell'>{claim.variableExpenses}</td>
                            <td className='tableCell'>{claim.isBillable}</td>
                            <td className='tableCell'>{claim.balanceAmount}</td>
                            <td className='tableCell'>{claim.claimComments}</td>
                            <td className='tableCell'>{claim.claimStatus}</td>
                            <td className='tableCell'>
                                                      
                                                     
       <button onClick={()=>downloadFile(claim.attachProof)}>Download</button>
    
                            </td>
                            <td><input className='right' type='submit' value="Edit" onClick={deleteClaimRecord}></input></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PageNation range={range} slice={slice} setPage={setPage} page={page}></PageNation>
        </div>
    );
}
