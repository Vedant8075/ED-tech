import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../Common/IconBtn"
import { useAuthStore } from "../../../../store/useStore"
import { useProfileStore } from "../../../../store/useStore"

export default function ChangeProfilePicture() {
  const token = useAuthStore((state) => state.token)
  const user = useProfileStore((state) => state.user)
  const setUser = useProfileStore((state) => state.setUser) 
   
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = async () => {
    try {
      if (!imageFile) return
      
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imageFile)

      const response = await updateDisplayPicture(token, formData)
      
      if (response) {
      
        setUser(response.updatedUserDetails) 
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log("ERROR MESSAGE - ", error.message)
    }
  }


  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])

  return (
    <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
      <div className="flex items-center gap-x-4">
        <img
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[78px] rounded-full object-cover"
        />
        <div className="space-y-2">
          <p className="text-lg font-semibold">Change Profile Picture</p>
          <div className="flex flex-row gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <button
              onClick={handleClick}
              disabled={loading}
              className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 hover:bg-richblack-600 transition-all duration-200"
            >
              Select
            </button>
            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleFileUpload}
            >
              {!loading && <FiUpload className="text-lg text-richblack-900" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  )
}