import { Outlet } from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar"

import { useAuthStore, useProfileStore } from "../../store/useStore" 

function Dashboard() {
  const profileLoading = useProfileStore((state) => state.loading)
  const authLoading = useAuthStore((state) => state.loading)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard