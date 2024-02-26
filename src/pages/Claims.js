import React from 'react'
import { useLocation } from 'react-router-dom';
import TableComponentClaim from '../components/TableComponentClaim';
import TableComponentClaimApprove from '../components/TableComponentClaimApprove';
import { useAuth } from '../components/Auth';

export const Claims = () => {
    const auth = useAuth();
    const location = useLocation();
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
            action: ''
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
            action: ''
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
            action: ''
        }
    ];
    const claimTypeList = ['boarding', 'Transport'];
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
            <h2>Manage Claims</h2>
            <div style={{ margin: "15px" }}>
                <TableComponentClaim data={claimsMaster} rowPerPage={10}></TableComponentClaim>
                <h2> Manage Claim Approval</h2>
                <TableComponentClaimApprove data={claimsMaster} rowPerPage={10}></TableComponentClaimApprove>
            </div>
        </div>
    )
}
