import React, { useEffect, useState } from 'react'
import { element } from 'prop-types';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import PageNation from './PageNation';
import {emptyClaim} from '../data/ClaimsData'
import TableUtil from './TableUtils';
import ClaimServices from '../services/ClaimServices';
import { emptyClaims } from '../data/ClaimsData';

export default function TableComponentClaimHrApprove({ data, rowPerPage }) {
    const [date, setDate] = useState(new Date());
    const [page, setPage] = useState(1);
    const { slice, range } = TableUtil(data.claimsData, page, rowPerPage);
    const [claims, setClaims] = useState(data.claimsData);
    const [selectedClaims, setSelectedClaims] = useState([]);
    const [isAllSeleted, setIsAllSeleted] = useState(false);
    const [selectedClaimRecords, setSelectedClaimRecords] = useState([...emptyClaims]);
    const clientList = data.clientData;
    const claimTypes = data.claimType;
    const action = data.actionType;

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
        const { name, value } = event.target;
        selectedClaimRecords(prevSelectedClaimRecords => prevSelectedClaimRecords.forEach(
            preCalimRec => {
                if (preCalimRec.id === key) {
                    preCalimRec[name] = value;
                }
            }
        ));
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
            const response = await ClaimServices.getClaims();
            const data = await response.json();
            setClaims(data);
        }
        catch (error) {
            console.log('Error fetching calims:', error);
        }
    };

    const saveClaimRecord = (claimRecord) => {
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
            const response = await ClaimServices.createClaim(claimRecord);
            const data = await response.json;
            setClaims([...claims, data]);
        } catch (error) {
            console.log("error adding claim:" + error);
        }

    };

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

    const downLoadFiles = (claimId) =>{

    }

    return (
        <div>
            <div style={{ display: "flex", float: "right" }}>
                <input className='right' type='submit' value="Save" onClick={saveClaimRecord}></input>
                {/* <input className='right' type='submit' value="Submit" onClick={updateClaimRecord}></input>  
      <input className='right' type='submit' value="Delete" onClick={deleteClaimRecord}></input>   */}
            </div>
            <br></br>
            <label><b>Pernding Approvals</b></label><br></br>
            <table className='table'>
                <thead className='tableRowHeader'>
                    <tr>
                        <th className='tableHeader'>
                            <input type='checkbox' checked={isAllSeleted} onChange={selectAll} />
                        </th>
                        <th className='tableHeader'>Claim No#</th>
                        <th className='tableHeader'>Date of Claim</th>
                        <th className='tableHeader'>Employee Name</th>
                        <th className='tableHeader'>Amount Claimed</th>
                        <th className='tableHeader'>Billabe</th>
                        <th className='tableHeader'>Non Billable</th>
                        <th className='tableHeader'>Advance</th>
                        <th className='tableHeader'>Balance</th>
                        <th className='tableHeader'>Action</th>
                        <th className='tableHeader'>Comments</th>
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
                            <td className='tableCell'>
                                <input
                                    name='id'
                                    value={claim.id}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='dateOfCalim'
                                    value={claim.dateOfCalim}
                                    onChange={onChangeInput}
                                    placeholder='enter Date'
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='name'
                                    value={claim.name}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='amountClaimed'
                                    value={claim.amountClaimed}
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
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled={isCalimSelected(claim) ? true : false}
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='billable'
                                    value={claim.billable}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled={isCalimSelected(claim) ? true : false}
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='nonBillable'
                                    value={claim.nonBillable}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled={isCalimSelected(claim) ? true : false}
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='advance'
                                    value={claim.advanceAmount}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='balance'
                                    value={claim.balance}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled='true'
                                />
                            </td>
                            <td className='tableCell'>
                                <select
                                    name='action'
                                    value={claim.action}
                                    onChange={onChangeInput}
                                    disabled={isCalimSelected(claim) ? true : false}
                                >
                                    {
                                        action.map(act =>
                                            <option value={act}>{act}</option>
                                        )}   ;
                                </select>
                            </td>
                            <td className='tableCell'>
                                <input
                                    name='comments'
                                    value={claim.commnents}
                                    onChange={onChangeInput}
                                    placeholder=''
                                    type='text'
                                    disabled='false'
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
