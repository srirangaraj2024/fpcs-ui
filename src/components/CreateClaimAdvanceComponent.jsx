import React, { Component } from 'react';
import EmployeeServices from '../services/EmployeeServices';

class CreateClaimAdvanceComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // step 2
           // id: this.props.match.params.id,
            employeeId: '',
            availedAmount: '',
            
        }
        this.changeEmployeeIdAmountHandler = this.changeEmployeeIdAmountHandler.bind(this);
        this.changeAvailedAmountHandler = this.changeAvailedAmountHandler.bind(this);
        this.saveOrUpdateClaim=this.saveOrUpdateClaim.bind(this);
    }
    saveOrUpdateClaim = (e) => {
        //e.preventDefault();
        let claimAdvance = {employeeId: this.state.employeeId, availedAmount: this.state.availedAmount};
        console.log('claim => ' + JSON.stringify(claimAdvance));

        // step 5
        
            EmployeeServices.addClaimAdvance(claimAdvance).then(res =>{
              //  this.props.history.push('/employees');
              
            });
        
    }
    cancel(){
        this.props.history.push('/employees');
    }
    changeEmployeeIdAmountHandler= (event) => {
        this.setState({employeeId: event.target.value});
    }

    changeAvailedAmountHandler= (event) => {
        this.setState({availedAmount: event.target.value});
    }
    render() {
        return (
            <div>
                <br></br>
                   <div className = "container">
                        <div className = "row">
                            <div className = "card col-md-6 offset-md-3 offset-md-3">
                                Claim Advance
                                <div className = "card-body">
                                    <form>
                                        <div className = "form-group">
                                            <label> Employee ID: </label>
                                            <input placeholder="Employee Id" name="employeeId" className="form-control" 
                                                value={this.state.employeeId} onChange={this.changeEmployeeIdAmountHandler}/>
                                        </div>
                                        <div className = "form-group">
                                            <label> Claim Advance: </label>
                                            <input placeholder="Claim Advance" name="availedAmount" className="form-control" 
                                                value={this.state.availedAmount} onChange={this.changeAvailedAmountHandler}/>
                                        </div>
                                        <button className="btn btn-success" onClick={this.saveOrUpdateClaim}>Save</button>
                                        <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                   </div>
            </div>
        );
    }
}

export default CreateClaimAdvanceComponent;