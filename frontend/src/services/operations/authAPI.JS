import { toast } from "react-hot-toast"
import { useAuthStore, useCartStore, useProfileStore } from "../../store/useStore"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export async function sendOtp(email, navigate) {
  const toastId = toast.loading("Loading...")
  useAuthStore.getState().setLoading(true)
  try {
    const response = await apiConnector("POST", SENDOTP_API, {
      email,
      checkUserPresent: true,
    })
    console.log("SENDOTP API RESPONSE............", response)
    console.log(response.data.success)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("OTP Sent Successfully")
    navigate("/verify-email")
  } catch (error) {
    console.log("SENDOTP API ERROR............", error)
    toast.error("Could Not Send OTP")
  }
  useAuthStore.getState().setLoading(false)
  toast.dismiss(toastId)
}

export async function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  const toastId = toast.loading("Loading...")
  useAuthStore.getState().setLoading(true)
  try {
    const response = await apiConnector("POST", SIGNUP_API, {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      otp,
    })

    console.log("SIGNUP API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Signup Successful")
    navigate("/login")
  } catch (error) {
    console.log("SIGNUP API ERROR............", error)
    toast.error("Signup Failed")
    navigate("/signup")
  }
  useAuthStore.getState().setLoading(false)
  toast.dismiss(toastId)
}

export async function login(email, password, navigate) {
  const toastId = toast.loading("Loading...")
  useAuthStore.getState().setLoading(true)
  
  try {
    const response = await apiConnector("POST", LOGIN_API, {
      email,
      password,
    })

    console.log("LOGIN API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Login Successful")
    
    // Update token in Zustand
    useAuthStore.getState().setToken(response.data.token)
    
    // Handle user image and update user in Zustand
    const userImage = response.data?.user?.image
      ? response.data.user.image
      : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      
    useProfileStore.getState().setUser({ ...response.data.user, image: userImage })
    
    localStorage.setItem("token", JSON.stringify(response.data.token))
    navigate("/dashboard/my-profile")
  } catch (error) {
    console.log("LOGIN API ERROR............", error)
    toast.error("Login Failed")
  }
  useAuthStore.getState().setLoading(false)
  toast.dismiss(toastId)
}

export async function getPasswordResetToken(email, setEmailSent) {
  const toastId = toast.loading("Loading...")
  useAuthStore.getState().setLoading(true)
  try {
    const response = await apiConnector("POST", RESETPASSTOKEN_API, {
      email,
    })

    console.log("RESETPASSTOKEN RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Reset Email Sent")
    setEmailSent(true)
  } catch (error) {
    console.log("RESETPASSTOKEN ERROR............", error)
    toast.error("Failed To Send Reset Email")
  }
  toast.dismiss(toastId)
  useAuthStore.getState().setLoading(false)
}

export async function resetPassword(password, confirmPassword, token, navigate) {
  const toastId = toast.loading("Loading...")
  useAuthStore.getState().setLoading(true)
  try {
    const response = await apiConnector("POST", RESETPASSWORD_API, {
      password,
      confirmPassword,
      token,
    })

    console.log("RESETPASSWORD RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Password Reset Successfully")
    navigate("/login")
  } catch (error) {
    console.log("RESETPASSWORD ERROR............", error)
    toast.error("Failed To Reset Password")
  }
  toast.dismiss(toastId)
  useAuthStore.getState().setLoading(false)
}

export function logout(navigate) {
  useAuthStore.getState().setToken(null)
  useProfileStore.getState().setUser(null)
  useCartStore.getState().resetCart()
  
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  
  toast.success("Logged Out")
  navigate("/")
}