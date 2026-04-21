import { useNavigate } from "react-router-dom"
import { BuyCourse } from "../../../../services/operations/studentFeaturesAPI"
import IconBtn from "../../../Common/IconBtn"
import { useAuthStore,useCartStore,useProfileStore } from "../../../../store/useStore"
export default function RenderTotalAmount() {
  const total = useCartStore((state) => (state.total))
  const cart = useCartStore((state) => (state.cart))
 
  const  token  =  useAuthStore((state) => state.token)
  const user  = useProfileStore((state) => state.user)
  const navigate = useNavigate()

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id)
    BuyCourse(token, courses, user, navigate)
  }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  )
}