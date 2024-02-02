
import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route,  Routes} from 'react-router-dom';
import ListEmpComponent from './components/ListEmpComponent';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';

import CreateClaimAdvanceComponent from './components/CreateClaimAdvanceComponent';

function App() {
  return (
    <div>
    <Router>
     
          <HeaderComponent />
        <div className="container"> 
        <Routes>
        <Route exact path = "/"  element = {<ListEmpComponent/>}></Route>
        <Route exact path = "/employees" element = {<ListEmpComponent/>}></Route>
         <Route exact path = "/claim-advance"  element = {<CreateClaimAdvanceComponent/>}></Route>
       </Routes> 
        </div> 
      <FooterComponent />
       
    </Router>
    </div>
  );
}

export default App;
