import React, { Component } from 'react';
import EmployeeServices from '../services/EmployeeServices';
import { Link } from 'react-router-dom';



class ListEmpComponent extends Component {
    constructor(props){
        super(props)
        this.state={
            employees:[]
        }
        //this.claimAdvance = this.claimAdvance.bind(this);
        
    }
    componentDidMount(){
        EmployeeServices.getEmployees().then((res)=>
        {this.setState({employees:res.data})});
    }
    
    render() {
        return (
            
            <div>
                 <h2 className="text-center">Leaves List</h2>
                 <div>
                    <button  >
                    <Link to={`/claim-advance`}>ClaimAdvance</Link></button>
                 </div>
                 <br></br>
                 <div className = "row">
                        <table className = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> employeeId</th>
                                    <th> officialMailId</th>
                                    <th> personalMailId</th>
                                    <th> mobileNumber </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.employees.map(
                                        employee => 
                                        <tr key = {employee.id}>
                                            <td> { employee.employeeId} </td>
                                             <td> { employee.officialMailId} </td>   
                                             <td> {employee.personalMailId}</td>
                                             <td> {employee.mobileNumber}</td>
                                             <td>
                                                 <button onClick={ () => this.editEmployee(employee.id)} className="btn btn-info">Update </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.deleteEmployee(employee.id)} className="btn btn-danger">Delete </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.viewEmployee(employee.id)} className="btn btn-info">View </button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                 </div>

            </div>
        );
    }
}

export default ListEmpComponent;