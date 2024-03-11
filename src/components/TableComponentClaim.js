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
    const [isConveyance, setIsConveyance] = useState(false);
    const [claimAttachment, setClaimAttachment] = useState([]);
    const { slice, range } = TableUtil(claims, page, rowPerPage);
    const [selectedClaims, setSelectedClaims] = useState([]);
    const [isAllSeleted, setIsAllSeleted] = useState(false);
    const [file, setFile] = useState("");
    const [selectedClaimRecords, setSelectedClaimRecords] = useState([]);
    const [isFixedExpenses, setIsFixedExpenses] = useState(true);
    const [selEditClaims, setSelEditClaims] = useState([...emptyClaims]);
    const [isEditEnabled, setIsEditEnabled] = useState(true);
    //const clientList = clientData;
    const claimTypes = data.claimType;
    
    const auth = useAuth();
    const [emp, setEmp] = useState(auth.user);

    const selectAll = () => {
        setSelectedClaims([]);
        setSelectedClaimRecords([]);
        setSelEditClaims([...emptyClaims]);
        if (!isAllSeleted) {
            claims.forEach(element => {
                if (element.claimStatus.includes('Saved')){
                    setSelectedClaims(prevSeletedClaims => [...prevSeletedClaims, element.claimId]);
                    setSelectedClaimRecords(prevSelectedClaimRecords => [...prevSelectedClaimRecords, element])
                }
            });
            setIsEditEnabled(false);
        }
        else {
            setSelectedClaimRecords([]);
            setSelectedClaims([]);
            setIsEditEnabled(true);
        }
        setIsAllSeleted(!isAllSeleted);
    }

    const handleClaimSelect = (claim) => {
        if(claim.claimStatus.includes('Saved')){
            if (selectedClaims.includes(claim.claimId)) {
                setSelectedClaims(preSelectedClaims => preSelectedClaims.filter(id => id !== claim.claimId));
                setSelectedClaimRecords(prevSelectedClaimRecords => prevSelectedClaimRecords.filter(
                    preClaim => preClaim.claimId !== claim.claimId));    
                if (selectedClaims.length === 1) {
                    setIsEditEnabled(true);
                }            
            } else {
                setSelectedClaims(preSelectedClaims => [...preSelectedClaims, claim.claimId]);
                setSelectedClaimRecords(prevSelectedClaimRecords => [...prevSelectedClaimRecords, claim]);
                if (selectedClaims.length === 0) {
                    setIsEditEnabled(false);
                    setSelEditClaims([...emptyClaims]);
                }
            }                       
        }        
        
    }

    const isCalimSelected = (claim) => {
        // const claimExist = selectedClaims.find(checkedClaim => checkedClaim === claim.claimId);
        // return (claimExist !== null || claimExist!=='');
        return selectedClaims.includes(claim.claimId);
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
            const tempRec = selEditClaims[key];
            tempRec.fixedExpenses = findClientRec.fixedExpenses;
            tempRec.totalAmount = '';
            if (findClientRec !== null && findClientRec.fixedExpenses!=='NA')   {
                tempRec.variableAmount = '';
            } else{
                tempRec.fixedExpenses = '';
                tempRec.noOfDays = '';
            } 
            const tempArray = [];
            tempArray.push(tempRec);

            setSelEditClaims(tempArray);                
        }
        if (name ==='noOfDays'){
            const findClientRec = clientData.find((cr) => cr.customerCode===value);
            //setIsFixedExpenses(findClientRec !== null && findClientRec.fixedExpenses !== 'NA');           
            const tempRec = selEditClaims[key];
            // emptyRec[0].fixedExpenses = findClientRec.fixedExpenses;
            tempRec.totalAmount = tempRec.fixedExpenses * value;
            const tempArray = [];
            tempArray.push(tempRec);
            setSelEditClaims(tempArray);
        }
        if (name === 'claimType'){
            const tempRec = selEditClaims[key];            
            if (value !== 'Conveyance'){
                setIsConveyance(false);
                tempRec.toPlace = '';
                tempRec.fromPlace = '';
            }else{
                setIsConveyance(true);
            }
        }
        const tempRec = selEditClaims[key];
        tempRec[name] = value;
        const updatedRec = [];
        updatedRec.push(tempRec);        
        setSelEditClaims(updatedRec);
    }

    const onfileUpload = (key, event) => {
        const { name, value } = event.target;
        selectedClaimRecords(prevSelectedClaimRecords => prevSelectedClaimRecords.forEach(
            preCalimRec => {
                if (preCalimRec.claimId === key) {
                    preCalimRec[name] = value;
                }
            }
        ));
    }        


    useEffect(() => {
        fetchCalims().then(() => {
            const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

            const emptClaim = emptyClaims;
            emptClaim[0].employeeId = emp.employeeId;
            emptClaim[0].claimDate = date;
            emptClaim[0].balanceAmount = emp.balanceAmount;
            setSelEditClaims(emptClaim);
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

    const editClaimRecord = (claimRecord) =>{
        const findClientRec = clientData.find((cr) => cr.customerCode === claimRecord.clientName);       
        setIsFixedExpenses(findClientRec && findClientRec.fixedExpenses !== '');
        const claimList = [];
        claimList.push(claimRecord);
        setSelEditClaims(claimList);
        setSelectedClaimRecords([]);
        setSelectedClaimRecords(prevSelectedClaimRecords => [...prevSelectedClaimRecords, claimRecord]);
        setSelectedClaims([]);
        setSelectedClaims(prevSeletedClaims => [...prevSeletedClaims, claimRecord.claimId]);
        setIsEditEnabled(true);
    }

    const saveClaimRecord = () => {   
        const claimRecord = selEditClaims[0];
        if (claimRecord.claimId !== '') {
            updateClaimRecord(claimRecord).then(() => {
                console.log('Claim updated successfully');
                alert('Claim Added successfully');
            });

        } else {
            addClaimRecord().then(() => {
                console.log('Claim Added successfully');
                alert('Claim Added successfully');
            });
        }

    };
    const addClaimRecord = async () => {
        try {
            const claimRecord = selEditClaims[0];
            claimRecord.employeeId=emp.employeeId;
            claimRecord.attachProof=file;
            const response = await ClaimServices.createClaim(claimRecord);
            const data = await response.data;
            setClaims(preClaims => [...preClaims, data]);
            setSelEditClaims(emptyClaims);
            setSelectedClaimRecords([]);
            setSelectedClaims([]);
            setIsEditEnabled(true);
        } catch (error) {
            console.log("error adding claim:" + error);
        }

    };
const downloadFile=async (fileLocation)=>{
    
       const response = await ClaimServices.downloadFile(fileLocation)
       var file = response.data;
       var reader = new FileReader();
          
       
    console.log("File attachment:" + file);
    
}


const uploadFile =async(index,e) => {
    try {
        const attachment=e.target.files[0];
      console.log(attachment)
     const formData = new FormData();
  formData.append("claimAttachment", attachment);
  formData.append("employeeId",emp.employeeId)
 await axios.post('http://fpcsdev.ap-southeast-1.elasticbeanstalk.com/fpcs/claims/uploadClaimProof',formData,
 //await axios.post('./images',formData,
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
    const submitClaimRecord = async () => {
        try {
            const claimRecords = isEditEnabled ? selEditClaims :selectedClaimRecords;
             ClaimServices.submitClaims(claimRecords).then(async (res) => {                
                if (res) {
                    alert(res);
                    const newRes = await ClaimServices.getClaims(emp.employeeId)
                    const data = await newRes.json();
                    console.log(data);
                        setClaims(data);
                        setSelectedClaimRecords([]);
                        setSelEditClaims([...emptyClaims]);
                        setSelectedClaims([]);
                        setIsEditEnabled(true);
                        alert("Claims are submitted successfully");
                }   
            })
                   
                        
        } catch (error) {
            console.log("error adding claim:" + error);
        }
    };
    const updateClaimRecord = async (claimRecord) => {
        try {
            const response = await ClaimServices.saveClaim(claimRecord);
            const updatedClaim = await response.json;
            const updatedClaims = claims.map(claim => claim.claimId === updatedClaim.claimId ? updatedClaim : claim);
            setClaims(updatedClaims);
            setSelectedClaimRecords([]);
            setSelectedClaims([]);
            setSelEditClaims([...emptyClaims]);
            setIsEditEnabled(true);
        } catch (error) {
            console.log("error adding claim:" + error);
        }
    };

    const deleteClaimRecord = async () => {
        try {
            if (selectedClaimRecords.length!==0){                
                ClaimServices.deleteClaims(selectedClaimRecords).then(async res => {
                    const clm = await ClaimServices.getClaims(emp.employeeId);
                    const data = await clm.json();
                    setClaims(data);
                    setSelectedClaimRecords([]);
                    setSelectedClaims([]);
                    setIsEditEnabled(true);
                    alert("Selected claims are deleted successfully");
                })                   
                    
            }else{
                alert('Select claim records to delete');
            }            
        } catch (error) {
            alert("error delteting claim:" + error);
            console.log("error delteting claim:" + error);
        }

    }
    return (
        <div>
            <div style={{ display: "flex", float: "right" }}>
                <input className='right' type='submit' id='save' value="Save"  onClick={()=>saveClaimRecord('Saved')}></input>
                <input className='right' type='submit' id='submit' value="Submit" onClick={submitClaimRecord}></input>
                <input className='right' type='submit' id='delete' value="Delete"  onClick={deleteClaimRecord}></input>
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
                        selEditClaims.map((claimRec, index )=> (
                            <tr key={claimRec.claimId}>
                                <td className='tableCell'>
                                    <input
                                        name='claimid'
                                        value={claimRec.claimId}
                                        onChange={(e) => onChangeInput(index,e)}
                                        placeholder=''
                                        type='text'
                                        disabled='true'
                                        style={{ width: "150px"}}                                       
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
                                        disabled='true'                                        
                                    />
                                </td>
                                <td className='tableCell'>
                                    <input
                                        name='employeeId'
                                        value={claimRec.employeeId}
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
                                        style={{ width: "150px" }}
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
                                        disabled={!isConveyance}
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
                                        disabled={!isConveyance}
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
                                        placeholder=''
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
                                        <option value='notSelected'>Select</option>
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
                        <th className='tableHeader'>Claim Status</th>
                        <th className='tableHeader'>Attachments</th>
                        <th className='tableHeader'>Action</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {slice.map((claim) => (
                        <tr className='tableRowItems' key={claim.claimId}>
                            <td className='tableCell'>
                                <input
                                    type='checkbox'
                                    checked={isCalimSelected(claim)}
                                    onChange={() => handleClaimSelect(claim)}
                                    disabled={!claim.claimStatus.includes('Saved')}
                                />
                            </td>
                           <td className='tableCell'>
                                <label style={{width:'150px'}}>
                                    {claim.claimId}
                                </label>
                            </td>
                            <td className='tableCell'>
                                <label style={{ width: '120px' }}>
                                    {claim.claimDate}
                                    </label>
                                </td>
                            <td className='tableCell'>
                                <label style={{width
                                :"150px"}}>
                                    {claim.employeeId}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{width:"150px"}}>
                                    {claim.claimType}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{width:"100px"}}>
                                    {claim.clientName}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{ width: "150px" }}>
                                    {claim.fromDate}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{width:"150px"}}>
                                    {claim.toDate}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{width:"150px"}}>
                                    {claim.fromPlace}
                                </label></td>
                            <td className='tableCell'>
                                <label style={{width: "150px"}}>
                                    {claim.toPlace}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{width:"100px"}}>
                                    {claim.fixedExpenses}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{width:"50px"}}>{claim.noOfDays}
                                </label></td>
                            <td className='tableCell'>
                                <label style={{width:"100px"}}>{claim.totalAmount}
                                </label></td>
                            <td className='tableCell'>
                                <label style={{
                                    width: "100px"
                                }}>{claim.variableExpenses}
                                </label></td>
                            <td className='tableCell'>
                                <label style={{
                                    width: "100px"
                                }}>
                                    {claim.isBillable}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{
                                    width: "150px"
                                }}>
                                    {claim.balanceAmount}</label>
                                    </td>
                            <td className='tableCell'>
                                <label style={{
                                    width: "250px"
                                }}>
                                    {claim.claimComments}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{
                                    width: "200px"
                                }}>
                                    {claim.claimStatus}
                                    </label></td>
                            <td className='tableCell'>
                                <label style={{width:"50px"
                                }}>
                                    {claim.attachProof}
                                    </label>
                            <button style={{width:"75px",height:"35px"
                                }} type='submit'  disabled={claim.fixedExpenses!=='NA'} onClick={() => downloadFile(claim.attachProof)}>
                            Attachment
                            </button>

                            </td>
                            <td className='tableCell'>
                                <input
                                    type='submit'
                                    value="Edit"
                                    disabled={!claim.claimStatus.includes('Saved')}
                                    onClick={() => editClaimRecord(claim)}>
                                </input>
                            </td>
                           
                        </tr>
                    ))}
                </tbody>
            </table>
            <PageNation range={range} slice={slice} setPage={setPage} page={page}></PageNation>
        </div>
    );
}
