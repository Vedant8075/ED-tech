import { useAuthStore } from "../../../store/useStore"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const  token  = useAuthStore((state) => state.token)

  if (token === null) {
    return children
  } else {
    return <Navigate to="/dashboard/my-profile" />
  }
}

export default OpenRoute