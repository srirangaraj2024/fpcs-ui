import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import TableComponentClaim from '../components/TableComponentClaim';
import TableComponentClaimApprove from '../components/TableComponentClaimApprove';
import { useAuth } from '../components/Auth';
import TableComponentClaimHrApprove from '../components/TableComponentClaimHrApprove';

export const Claims = () => {
    const auth = useAuth();
    const location = useLocation();
    const navigator = useNavigate();
    const [emp, setEmp] = useState(auth.user);
    auth.menuSelected(location.pathname);
    const data = [
        {
            id: '03',
            name: 'Dan Doe',
            dateOfClaim: '15/02/2024',
            claimType: 'Transport',
            clientName: 'abc',
            fromDate: '15/02/2024',
            toDate: '15/02/2024',
            fromPlace: 'abcd',
            toPlace: 'xyz',
            fixedExpenceses: '200',
            noOfDays: '10',
            totalAmount: '',
            variableAmount: '',
            billable: '',
            balanceAmount: '',
            comments: 'test',
            attachments: 'abc.txt',
            amountClaimed: '',
            approvedAmount: '',
            nonBillable: '',
            advance: '',
            balance: '',
            action: '',
            status: 'submited for approval'
        },
        {
            id: '02',
            name: 'John Doe',
            dateOfClaim: '15/02/2024',
            claimType: 'Transport',
            clientName: 'abc',
            fromDate: '15/02/2024',
            toDate: '15/02/2024',
            fromPlace: 'abcd',
            toPlace: 'xyz',
            fixedExpenceses: '200',
            noOfDays: '10',
            totalAmount: '',
            variableAmount: '',
            billable: '',
            balanceAmount: '',
            comments: 'test',
            attachments: 'abc.txt',
            amountClaimed: '',
            approvedAmount: '',
            nonBillable: '',
            advance: '',
            balance: '',
            action: '',
            status: 'Saved'
        },
        {
            id: '01',
            name: 'John Doe',
            dateOfClaim: '15/02/2024',
            claimType: 'Transport',
            clientName: 'xyz',
            fromDate: '15/02/2024',
            toDate: '15/02/2024',
            fromPlace: 'abcd',
            toPlace: 'xyz',
            fixedExpenses: '200',
            noOfDays: '10',
            totalAmount: '',
            variableAmount: '',
            billable: '',
            balanceAmount: '',
            comments: 'test',
            attachments: 'abc.txt',
            amountClaimed: '',
            approvedAmount: '',
            nonBillable: '',
            advance: '',
            balance: '',
            action: '',
            status: ''
        }
    ];
    const claimTypeList = ['Boarding','Transport', 'Conveyance', 'Food', 'Lodging', 'Laptop', 'Repairs', 'Stationary', 'Others'];
    const actionList = ['Approved', 'Reject', 'Hold'];
    const clientList = [
        {
            clientType: 'abc',
            claimType: 'fixed',
            fixedExpenses: '200'
        },
        {
            clientType: 'xyz',
            claimType: 'variable',
            fixedExpenses: '0'
        }
    ];
    const claimsMaster =
    {
        claimsData: data,
        clientData: clientList,
        claimType: claimTypeList,
        actionType: actionList
    };

    return (
        <div className='workarea'>
            {
                auth.userName!==null?
                <>
                        <h2>Manage Claims</h2>
                        <div style={{ margin: "15px" }}>
                            <TableComponentClaim data={claimsMaster} rowPerPage={10}></TableComponentClaim>
                        </div>
                        <div style={{ margin: "15px", display: emp.employeeRole === 'Team Lead' ? 'inline' : 'none' }}>
                            <h2> Manage Claim Lead Approval</h2>
                            <TableComponentClaimApprove data={claimsMaster} rowPerPage={10}></TableComponentClaimApprove>
                        </div>
                        <div style={{ margin: "15px", display: emp.employeeRole === 'HR' ? 'inline' : 'none' }}>
                            <h2> Manage Claim HR Approval</h2>
                            <TableComponentClaimHrApprove data={claimsMaster} rowPerPage={10}></TableComponentClaimHrApprove>
                        </div>
                </> : navigator("/")
            }
            
        </div>
    )
}
