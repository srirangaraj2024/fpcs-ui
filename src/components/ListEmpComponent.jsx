import React, { Component } from 'react';
import EmployeeServices from '../services/EmployeeServices';

class ListEmpComponent extends Component {
    constructor(props){
        super(props)
        this.state={
            employees:[]
        }
    }
    componentDidMount(){
        EmployeeServices.getEmployees().then((res)=>
        {this.setState({employees:res.data})});
    }
    render() {
        return (
            
            <div>
                 <h2 className="text-center">Leaves List</h2>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={this.addEmployee}> Add Employee</button>
                 </div>
                 <br></br>
                 <div className = "row">
                        <table className = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> UserID</th>
                                    <th> FromDate</th>
                                    <th> ToDate</th>
                                    <th> days </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.employees.map(
                                        employee => 
                                        <tr key = {employee.id}>
                                            <td> { employee.userId} </td>
                                             <td> { employee.fromDate} </td>   
                                             <td> {employee.toDate}</td>
                                             <td> {employee.days}</td>
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