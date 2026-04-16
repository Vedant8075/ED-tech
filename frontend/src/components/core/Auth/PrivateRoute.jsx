
import { useAuthStore } from "../../../store/useStore"
import { Navigate } from "react-router-dom"

function PrivateRoute({ children }) {
  const  token  = useAuthStore((state) => state.token)

  if (token !== null) {
    return children
  } else {
    return <Navigate to="/login" />
  }
}

export default PrivateRoute