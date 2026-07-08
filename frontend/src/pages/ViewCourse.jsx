import { useEffect, useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import { useAuthStore, useViewCourseStore } from "../store/useStore"

export default function ViewCourse() {
  const { courseId } = useParams()
  const token=useAuthStore((state)=>state.token)
  const setCourseSectionData=useViewCourseStore((state)=>state.setCourseSectionData)
  const setEntireCourseData=useViewCourseStore((state)=>state.setEntireCourseData)
  const setCompletedLectures=useViewCourseStore((state)=>state.setCompletedLectures)
  const setTotalNoOfLectures=useViewCourseStore((state)=>state.setTotalNoOfLectures)
  const [reviewModal, setReviewModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
    setCourseSectionData(courseData.courseDetails.courseContent)
    setEntireCourseData(courseData.courseDetails)
    setCompletedLectures(courseData.completedVideos)
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      setTotalNoOfLectures(lectures)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}