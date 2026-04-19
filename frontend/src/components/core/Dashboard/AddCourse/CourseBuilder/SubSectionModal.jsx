import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"

import { useAuthStore,useCourseStore } from "../../../../../store/useStore"

import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const [loading, setLoading] = useState(false)

  const token = useAuthStore((state) => state.token)
  const course = useCourseStore((state) => state.course)
  const setCourse = useCourseStore((state) => state.setCourse)

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [view, edit, modalData, setValue])

  // 🧠 Check if form changed
  const isFormUpdated = () => {
    const currentValues = getValues()
    return (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    )
  }

  // ✏️ EDIT FUNCTION
  const handleEditSubsection = async () => {
    const currentValues = getValues()
    const formData = new FormData()

    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)

    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("videoFile", currentValues.lectureVideo)
    }

    setLoading(true)
    const result = await updateSubSection(formData, token)

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )

      const updatedCourse = {
        ...course,
        courseContent: updatedCourseContent,
      }

      setCourse(updatedCourse) 
    }

    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("videoFile", data.lectureVideo)
    formData.append("timeDuration", "0")

    setLoading(true)
    const result = await createSubSection(formData, token)

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )

      const updatedCourse = {
        ...course,
        courseContent: updatedCourseContent,
      }

      setCourse(updatedCourse) // ✅ Zustand update
    }

    setModalData(null)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[700px] rounded-lg border bg-richblack-800">

        {/* Header */}
        <div className="flex items-center justify-between bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-8">

          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          <input
            disabled={view || loading}
            placeholder="Lecture Title"
            {...register("lectureTitle", { required: true })}
            className="form-style"
          />

          <textarea
            disabled={view || loading}
            placeholder="Lecture Description"
            {...register("lectureDesc", { required: true })}
            className="form-style"
          />

          {!view && (
            <IconBtn
              disabled={loading}
              text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
            />
          )}
        </form>
      </div>
    </div>
  )
}