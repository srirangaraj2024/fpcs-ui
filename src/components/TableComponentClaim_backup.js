import React, { useEffect, useState } from 'react'
import { element } from 'prop-types';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import PageNation from './PageNation';
import TableUtil from './TableUtils';
import ClaimServices from '../services/ClaimServices';
import { emptyClaims } from '../data/ClaimsData';
import '../styles/Table.css'


export default function TableComponentClaim({ data, rowPerPage }) {
    const [date, setDate] = useState(new Date());
    const [page, setPage] = useState(1);
    const [clientData, setClientData] = useState([]);
    const [claims, setClaims] = useState([]);
    const [claimAttachment, setClaimAttachment] = useState([]);
    const { slice, range } = TableUtil(claims, page, rowPerPage);
    const [selectedClaims, setSelectedClaims] = useState([]);
    const [isAllSeleted, setIsAllSeleted] = useState(false);
    const [file, setFile] = useState();
    const [selectedClaimRecords, setSelectedClaimRecords] = useState([...emptyClaims]);
    //const clientList = clientData;
    const claimTypes = data.claimType;
    

    const selectAll = () => {
        setSelectedClaims([]);
        if (!isAllSeleted) {
            claims.array.forEach(element => {
                setSelectedClaims(prevSeletedClaims => [...prevSeletedClaims, element.name]);
            });
            setSelectedClaimRecords([...claims]);
        }
        else {
            setSelectedClaimRecords([...emptyClaims]);
        }
        setIsAllSeleted(!isAllSeleted);
    }

    const handleClaimSelect = (claim) => {
        if (selectedClaims.includes(claim.name)) {
            setSelectedClaims(preSelectedClaims => preSelectedClaims.filter(name => name !== claim.name));
            setSelectedClaimRecords(prevSelectedClaimRecords => prevSelectedClaimRecords.filter(
                preClaim => preClaim.name !== claim.name));
        } else {
            setSelectedClaims(preSelectedClaims => [...preSelectedClaims, claim.name]);
            if (selectedClaimRecords.length === 1 && selectedClaimRecords[0].name === '') {
                setSelectedClaimRecords([...claim]);
            } else {
                setSelectedClaimRecords(prevSelectedClaimRecords => [...prevSelectedClaimRecords, claim]);
            }
        }
        
    }

    const isCalimSelected = (claim) => {
        return selectedClaims.includes(claim.name);
    }

    const isAllCalimsSelected = () => {
        return selectedClaims.lengh = claims.length;
    }

    const onChangeInput = (key, event) => {
        //alert(event.target);
        const { name, value } = event.target;
        //alert(key);
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
            
            console.log("claim data fetched successfully");
        });
    }, []);

    const fetchCalims = async () => {
        try {
                 const cliamResponse = await ClaimServices.getClaims();
                 const data = await cliamResponse.json();
                 setClaims(data);

                 const clientresponse= await ClaimServices.getClientMaster();
                 const clientData= await clientresponse.json();
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
            claimRecord.employeeId="emp123";
      
            const response = await ClaimServices.createClaim(claimRecord);
            const data = await response.json();
            setClaims([...claims, data]);
        } catch (error) {
            console.log("error adding claim:" + error);
        }

    };
    const uploadFileTo= async() =>{
const formData = new FormData();
  formData.append("myFile", file);
  fetch('http://localhost:5000/fpcs/claims/uploadClaimProof',
  {method:'POST',
        body:formData
    }).then((res)=>res.json())
            .then((result)=>{console.log("result"+result)})
                .catch((error)=>{
                    console.log("errpr"+error)})
            
    }
const uploadFile =async(index,e) => {
    try {
   setFile(e.target.files[0])
   console.log(e.target.files[0])
         //const { name, value } = e.target;
        //console.log(e);
       // const response = await ClaimServices.uploadClaimAttachment(e.target.files[0]);
       // const data = await response.json();
       // const tempRec = selectedClaimRecords[index];
       // tempRec[name] = data;
        //const updatedRec = [];
       // updatedRec.push(tempRec);
        
    } catch (error) {
        console.log("error adding claim:" + error);
    }
}
    const updateClaimRecord = async (claimRecord) => {
        try {
            const response = await ClaimServices.updateClaim(claimRecord, claimRecord.id);
            const updatedClaim = await response.json;
            const updatedClaims = claims.map(claim => claim.id === updatedClaim.id ? updatedClaim : claim);
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
                                       
                                    />
                                </td>
                                <td style={{ width: "150px" }}>
                                    <input
                                        name='claimDate'
                                        value={claimRec.claimDate}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='enter Date'
                                        type='text'
                                        
                                    />
                                </td>
                                <td style={{ width: "250px" }}>
                                    <input
                                        name='name'
                                        value={claimRec.name}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                        
                                    />
                                </td>
                                <td style={{ width: "350px" }}>
                                    <select
                                        value={claimRec.claimType}
                                        name='claimType'
                                        
                                        onChange={(e) => onChangeInput(index,e)}
                                        >
                                        {claimTypes.map(claimType =>
                                            <option value={claimType}>{claimType}</option>
                                        )};
                                    </select>
                                </td>
                                <td style={{ width: "200px" }}>
                                    <select
                                        value={claimRec.clientName}
                                        name='clientName'
                                        onChange={(e) => onChangeInput(index,e)}
                                        >
                                        {clientData.map(clientType =>
                                            <option value={clientType.customerCode}>{clientType.customerCode}</option>
                                        )};
                                    </select>
                                </td>
                                <td style={{ width: "200px" }}>
                                    <DatePicker selected={date} name='fromDate' value={claimRec.fromDate} onChange={(e) => onChangeInput(index,e)} />
                                </td>
                                <td style={{ width: "200px" }}>
                                    <DatePicker selected={date} name='toDate' value={claimRec.toDate} onChange={(e) => onChangeInput(index,e)} />
                                </td>
                                <td style={{ width: "200px" }}>
                                    <input
                                        name='fromPlace'
                                        value={claimRec.fromPlace}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter Place'
                                        type='text'
                                      
                                    />
                                </td>
                                <td style={{ width: "100px" }}>
                                    <input 
                                        name='toPlace'
                                        value={claimRec.toPlace}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter place'
                                        type='text'
                                    
                                    />
                                </td>
                                <td style={{ width: "100px" }}>
                                    <input
                                        name='fixedExpenses'
                                        value={claimRec.fixedExpenses}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                        disabled='true'
                                        
                                    />
                                </td>
                                <td style={{ width: "100px" }}>
                                    <input
                                        name='noOfDays'
                                        value={claimRec.noOfDays}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter Days'
                                        type='text'
                                       
                                    />
                                </td>
                                <td style={{ width: "100px" }}>
                                    <input
                                        name='totalAmount'
                                        value={claimRec.totalAmount}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                       
                                    />
                                </td>
                                <td style={{ width: "100px" }}>
                                    <input
                                        name='variableExpenses'
                                        value={claimRec.variableExpenses}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter Amount'
                                        type='text'
                                       
                                    />
                                </td>
                                <td style={{ width: "100px" }}>
                                    <select
                                        name='isBillable'
                                        value={claimRec.isBillable}
                                        onChange={(e) => onChangeInput(index,e)}
                                      >
                                        <option value='Yes'>Yes</option>
                                        <option value='No'>No</option>
                                    </select>
                                </td>
                                <td style={{ width: "100px" }}>
                                    <input
                                        name='balanceAmount'
                                        value={claimRec.balanceAmount}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                      
                                    />
                                </td>
                                <td style={{ width: "100px" }}>
                                    <input
                                        name='claimComments'
                                        value={claimRec.claimComments}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder='Enter comments'
                                        type='false'
                                    />
                                </td>
                                <td style={{ width: "50px" }}>
                                    <input
                                        name='attachProof'
                                       // value={claimRec.attachProof}
                                        onChange={(e) => uploadFile(index,e)}
                                        placeholder=''
                                        type='file'
                                        
                                    />
                                    <button onClick={uploadFileTo}>upload</button>
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
                            <input type='checkbox' checked={isAllSeleted} onChange={selectAll} />
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
                                />
                            </td>
                            <td className='tableCell'>{claim.claimId}</td>
                            <td className='tableCell'>{claim.claimDate}</td>
                            <td className='tableCell'>{claim.name}</td>
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
                            <td className='tableCell'>{claim.attachProof}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            <PageNation range={range} slice={slice} setPage={setPage} page={page}></PageNation>
        </div>
    );
}
