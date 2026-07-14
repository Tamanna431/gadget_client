import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // ✅ সবচেয়ে জরুরি: এটি ব্রাউজারের BetterAuth Cookie অটোমেটিক ব্যাকএন্ডে পাঠায়
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ রেসপন্স ইন্টারসেপ্টর (Bonus: সেশন এক্সপায়ার হলে অটোমেটিক হ্যান্ডেল করবে)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // যদি 401 Unauthorized আসে, মানে সেশন শেষ বা লগইন করা নেই
    if (error.response?.status === 401) {
      console.warn('⚠️ Session expired or unauthorized.');
      // চাইলে এখানে অটোমেটিক লগইন পেজে রিডাইরেক্ট করতে পারেন:
      // if (typeof window !== 'undefined') {
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default api;