import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../Common/IconBtn"
import { useAuthStore, useProfileStore } from "../../../../store/useStore"

export default function UpdatePassword() {
  const token = useAuthStore((state) => state.token)
  const user = useProfileStore((state) => state.user) 
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    try {
      const formData = { ...data, email: user?.email }
      console.log("SENDING PASSWORD DATA:", formData)
      
      await changePassword(token, formData)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            
            {/* Current Password */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="oldpassword" className="lable-style">
                Current Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldpassword"
                id="oldpassword"
                placeholder="Enter Current Password"
                className="form-style"
                {...register("oldpassword", { required: true })}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldpassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div>

            {/* New Password */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="newpassword" className="lable-style">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newpassword"
                id="newpassword"
                placeholder="Enter New Password"
                className="form-style"
                {...register("newpassword", { required: true })}
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newpassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your New Password.
                </span>
              )}
            </div>
            
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update" />
        </div>
      </form>
    </>
  )
}