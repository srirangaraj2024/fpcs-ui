export const data = [
    {
        id: '03',
        employeeId:'',
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
        employeeId:'',
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
    {id: '01',
    employeeId:'',
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

export const emptyClaims = [{
    id: '',
    employeeId:'',
    name: '',
    claimDate: '15/02/2024',
    claimType: '',
    clientName: '',
    fromDate: '',
    toDate: '',
    fromPlace: '',
    toPlace: '',
    fixedExpenses: '',
    noOfDays: '',
    totalAmount: '',
    variableAmount: '',
    isBillable: '',
    balanceAmount: '',
    claimComments: '',
    attachProof: '',
    amountClaimed: '',
    approvedAmount: '',
    claimApprover: '',
    claimStatus:'',
    advance: '',
    balance: '',
    action: ''
}];
export const claimTypeList = ['boarding','Transport'];
export const actionList = ['Approved','Reject','Hold'];
export const clientList = [
{
    clientType: 'abc',
    claimType: 'fixed',
    fixedExpenses:'200'
},
{
    clientType: 'xyz',
    claimType: 'variable',
    fixedExpenses:'0'
}
];
export const claimsMaster = [
    {
        claimsData: data,
        clientData: clientList,
        claimType: claimTypeList,
        actionType: actionList
    }
];