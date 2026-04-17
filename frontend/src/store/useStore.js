import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";


export const useAuthStore = create(
  persist(
    (set) => ({
      signupData: null,
      loading: false,
      token: null,
      setSignupData: (data) => set({ signupData: data }),
      setLoading: (loading) => set({ loading }),
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-storage", 
    }
  )
);


export const useProfileStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "profile-storage",
    }
  )
);


export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      total: 0,
      totalItems: 0,

      addToCart: (course) => {
        const { cart, total, totalItems } = get();
        const index = cart.findIndex((item) => item._id === course._id);

        if (index >= 0) {
          toast.error("Course already in cart");
          return;
        }

        set({
          cart: [...cart, course],
          total: total + course.price,
          totalItems: totalItems + 1,
        });
        toast.success("Course added to cart");
      },

      removeFromCart: (courseId) => {
        const { cart, total, totalItems } = get();
        const courseToRemove = cart.find((item) => item._id === courseId);

        if (courseToRemove) {
          set({
            cart: cart.filter((item) => item._id !== courseId),
            total: total - courseToRemove.price,
            totalItems: totalItems - 1,
          });
          toast.success("Course removed from cart");
        }
      },

      resetCart: () => set({ cart: [], total: 0, totalItems: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
);

export const useCourseStore = create(
  persist(
    (set) => ({
      step: 1,
      course: null,
      editCourse: false,
      paymentLoading: false,

      setStep: (step) => set({ step }),
      setCourse: (course) => set({ course }),
      setEditCourse: (isEditing) => set({ editCourse: isEditing }),
      setPaymentLoading: (isLoading) => set({ paymentLoading: isLoading }),
      resetCourseState: () => set({ step: 1, course: null, editCourse: false }),
    }),
    {
      name: "course-storage",
    }
  )
);


export const useViewCourseStore = create((set) => ({
  courseSectionData: [],
  courseEntireData: [],
  completedLectures: [],
  totalNoOfLectures: 0,

  setCourseSectionData: (data) => set({ courseSectionData: data }),
  setEntireCourseData: (data) => set({ courseEntireData: data }),
  setTotalNoOfLectures: (count) => set({ totalNoOfLectures: count }),
  setCompletedLectures: (lectures) => set({ completedLectures: lectures }),
  updateCompletedLectures: (lecture) =>
    set((state) => ({
      completedLectures: [...state.completedLectures, lecture],
    })),
}));