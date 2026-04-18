import { toast } from "react-hot-toast"
import { useProfileStore } from "../../store/useStore" // Assuming this contains setUser and setLoading
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
} = profileEndpoints

export const getUserDetails = async (token, navigate) => {
  const { setUser, setLoading } = useProfileStore.getState();  
  const toastId = toast.loading("Loading...")
  setLoading(true)
  try {
    const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    const userImage = response.data.data.image
      ? response.data.data.image
      : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`

    setUser({ ...response.data.data, image: userImage })
    
  } catch (error) {
    logout(navigate); 
    console.log("GET_USER_DETAILS API ERROR............", error)
    toast.error("Could Not Get User Details")
  } finally {
    toast.dismiss(toastId)
    setLoading(false)
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}