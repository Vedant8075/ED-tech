import{Route,Routes} from "react-router-dom"
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Common/Navbar"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from "./pages/VerifyEmail"
import Dashboard from "./pages/Dashboard"
import About from "./pages/About"
import MyProfile from "./components/core/Dashboard/MyProfile"
const App = () => {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}/>
          <Route
          path="login"
          element={
              <Login />
          }
        />
        <Route
          path="signup"
          element={
              <Signup/>
          }
        />
        <Route
          path="forgot-password"
          element={
              <ForgotPassword/>
          }
        />
        <Route
          element={
              <Dashboard />
          }
        ></Route>
         <Route
          path="update-password/:id"
          element={
              <UpdatePassword />
          }
        />
        <Route
          path="update-password/:id"
          element={
              <UpdatePassword />
          }
        />
        <Route
          path="verify-email"
          element={
             <VerifyEmail/>
          }
        />
        <Route
          path="about"
          element={
            <About/>             
          }
        />
        <Route path="dashboard/my-profile" element ={<MyProfile></MyProfile>}/>
      </Routes>
    </div>
  )
}

export default App