import './App.css';
import { NavigationComponent} from './pages/NavigationComponent';
import {Admin} from './pages/Admin';
import {LoginComponent} from './pages/LoginComponent';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { LeaveManagement } from './pages/LeaveManagement';
import { Hr } from './pages/Hr';
import { Claims } from './pages/Claims';
import FooterComponent from './components/FooterComponent';
import {BrowserRouter, Route, Routes, useLocation} from 'react-router-dom';
import { AuthProvider } from './components/Auth';
import {Sidebar} from './components/Sidebar'

function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <div className='App'>
        <header>
          <NavigationComponent></NavigationComponent>
        </header>
        <div className='container'>
          {
            location.pathname === '/' ? null : <Sidebar/>
          }
          <main>
            <Routes>
              <Route path='/' element={<LoginComponent />} />
              <Route path='/claims' element={<Claims />} />
              <Route path='/login' element={<LoginComponent />} />
              <Route path='/employeeManagement' element={<EmployeeManagement />} />
              <Route path='/hr' element={<Hr />} />
              <Route path='/leaveManagement' element={<LeaveManagement />} />
              <Route path='/admin' element={<Admin />} />
            </Routes>
          </main>

        </div>
        <footer>
          <FooterComponent />
        </footer>
      </div>
    </AuthProvider>
   
  );
}

export default App;
