import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuthStore,useCourseStore } from "../../../../store/useStore"
import {
  fetchCourseDetails,
  getFullDetailsOfCourse,
} from "../../../../services/operations/courseDetailsAPI"
import RenderSteps from "../AddCourse/RenderSteps"

export default function EditCourse() {
  const { courseId } = useParams()
  const  course  = useCourseStore((state) => state.course)
  const setCourse = useCourseStore((state) => state.setCourse);
  const setEditCourse = useCourseStore((state) => state.setEditCourse);
  const [loading, setLoading] = useState(false)
  const token  = useAuthStore((state) => state.token)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token)
      const courseData = result?.courseDetails || result

      if (courseData) {
        setEditCourse(true)
        setCourse(courseData)
      }
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  )
}