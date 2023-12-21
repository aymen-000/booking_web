
import {Route, Routes} from 'react-router-dom'
import Index from './pages/Index';
import Login from './pages/Login';
import Layout from './Layout';
import Register from './pages/Register';
import axios from 'axios';
import { UserContextProvider } from './userContext';
import AcountPage from './pages/AcountPage';
import Places from './pages/Places';
import NewPlace from './pages/NewPlace';
import PlacePage from './pages/PlacePage';
import Booking from './pages/Booking';
axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.withCredentials =true
function App() {
  return (
    <UserContextProvider >
      <Routes>
        <Route element={<Layout/>} path='/'>
          <Route element={<Index/>} index/>
          <Route element = {<Login/>} path='/login'/>
          <Route element={<Register/>} path='/register'/>
          <Route element={<AcountPage/>} path='/acount/:subpage?'/>
          <Route element={<AcountPage/>} path='/acount/:subpage/:action?'/>
          <Route element={<NewPlace/>} path='/acount/new/:id?'/>
          <Route element={<PlacePage/>} path='/placepage/:id'/>
          <Route element={<AcountPage/>} path='/acount/:subpage'></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
