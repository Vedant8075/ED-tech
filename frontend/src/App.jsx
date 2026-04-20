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
import Settings from "./components/core/Dashboard/Settings"
import MyProfile from "./components/core/Dashboard/MyProfile"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import Cart from "./components/core/Dashboard/Cart"
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses"
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
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
              <OpenRoute>
              <Signup />
             </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
         <Route
          path="update-password/:id"
          element={
             <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
              <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="about"
          element={
            <About/>             
          }
        />
        <Route
          element={
              <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
        <Route path="dashboard/my-profile" element ={<MyProfile></MyProfile>}/>
        <Route path="dashboard/settings" element={<Settings></Settings>}/>
        <Route path="dashboard/cart" element={<Cart></Cart>}/>
        <Route  path="dashboard/enrolled-courses"  element={<EnrolledCourses />}  />
        <Route  path="dashboard/add-course"  element={<AddCourse></AddCourse>}  />
        <Route path="dashboard/my-courses" element={<MyCourses />} />

        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App