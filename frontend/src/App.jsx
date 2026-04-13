import React from 'react'
import{Route,Routes} from "react-router-dom"
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Common/Navbar"
const App = () => {
  return (
    <div>
      <Navbar>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}/>
      </Routes>
    </div>
  )
}

export default App