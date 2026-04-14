import { create } from "zustand";
import { toast } from "react-hot-toast";


export const useAuthStore = create((set) => ({
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,

  setSignupData: (data) => set({ signupData: data }),
  setLoading: (loading) => set({ loading }),
  setToken: (token) => set({ token }),
}));


export const useCartStore = create((set, get) => ({
  cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
  total: localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0,
  totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,

  addToCart: (course) => {
    const { cart, total, totalItems } = get(); // Read current state
    const index = cart.findIndex((item) => item._id === course._id);

    if (index >= 0) {
      toast.error("Course already in cart");
      return;
    }

    // Calculate new values
    const newCart = [...cart, course];
    const newTotal = total + course.price;
    const newTotalItems = totalItems + 1;

    // Update state
    set({ cart: newCart, total: newTotal, totalItems: newTotalItems });

    // Update local storage
    localStorage.setItem("cart", JSON.stringify(newCart));
    localStorage.setItem("total", JSON.stringify(newTotal));
    localStorage.setItem("totalItems", JSON.stringify(newTotalItems));
    
    toast.success("Course added to cart");
  },

  removeFromCart: (courseId) => {
    const { cart, total, totalItems } = get();
    const index = cart.findIndex((item) => item._id === courseId);

    if (index >= 0) {
      const courseToRemove = cart[index];
      
      const newCart = cart.filter((item) => item._id !== courseId);
      const newTotal = total - courseToRemove.price;
      const newTotalItems = totalItems - 1;

      set({ cart: newCart, total: newTotal, totalItems: newTotalItems });

      localStorage.setItem("cart", JSON.stringify(newCart));
      localStorage.setItem("total", JSON.stringify(newTotal));
      localStorage.setItem("totalItems", JSON.stringify(newTotalItems));
      
      toast.success("Course removed from cart");
    }
  },

  resetCart: () => {
    set({ cart: [], total: 0, totalItems: 0 });
    localStorage.removeItem("cart");
    localStorage.removeItem("total");
    localStorage.removeItem("totalItems");
  },
}));


export const useCourseStore = create((set) => ({
  step: 1,
  course: null,
  editCourse: false,
  paymentLoading: false,

  setStep: (step) => set({ step }),
  setCourse: (course) => set({ course }),
  setEditCourse: (isEditing) => set({ editCourse: isEditing }),
  setPaymentLoading: (isLoading) => set({ paymentLoading: isLoading }),
  resetCourseState: () => set({ step: 1, course: null, editCourse: false }),
}));


export const useProfileStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

// ==============================
// 6. VIEW COURSE STORE
// ==============================
export const useViewCourseStore = create((set) => ({
  courseSectionData: [],
  courseEntireData: [],
  completedLectures: [],
  totalNoOfLectures: 0,

  setCourseSectionData: (data) => set({ courseSectionData: data }),
  setEntireCourseData: (data) => set({ courseEntireData: data }),
  setTotalNoOfLectures: (count) => set({ totalNoOfLectures: count }),
  setCompletedLectures: (lectures) => set({ completedLectures: lectures }),
  
  // For updating, we use the callback version of set() to safely access 
  // the previous state and append the new lecture to the array
  updateCompletedLectures: (lecture) => set((state) => ({
    completedLectures: [...state.completedLectures, lecture]
  })),
}));


