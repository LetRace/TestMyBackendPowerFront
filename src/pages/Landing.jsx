import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Custom Hooks
import { useCategories } from "@/hooks/useCategories";
import { useLatestListings } from "@/hooks/useLatestListings";

// Utilities
import { fetchCategoryBySlug } from "@/utils/categoryUtils";

// Components
import HeroSection from "@/components/HeroSection.jsx";
import LatestListingsSection from "@/components/LatestListingsSection.jsx";
import FooterCategories from "@/components/FooterCategories.jsx";
import AuthModal from "@/components/AuthModal.jsx";

/**
 * Landing Page Component
 * 
 * หน้าแรกของเว็บไซต์ที่แสดง:
 * - Hero section พร้อม call-to-action
 * - ประกาศล่าสุด
 * - หมวดหมู่สินค้าทั้งหมดใน footer
 * - Modal สำหรับ authentication
 * 
 * @param {Function} setToken - function สำหรับจัดการ authentication token
 * @param {Object} user - ข้อมูล user ที่ login อยู่
 * @param {Function} setUsers - function สำหรับจัดการ users state
 */
function Landing({ setToken, user, setUsers, setRole, role }) {
  const navigate = useNavigate();

  // สถานะสำหรับ Auth Modal (null = ปิด, "login" = เปิด)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ใช้ custom hooks สำหรับดึงข้อมูล
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  const {
    latestListings,
    isLoading: isLoadingListings,
    error: listingsError,
  } = useLatestListings(4);

  /**
   * Initialize AOS (Animate On Scroll) library
   * ใช้สำหรับ animation เมื่อ scroll
   */
  useEffect(() => {
    AOS.init({
      duration: 800, // ระยะเวลา animation (มิลลิวินาที)
      once: true, // animate เพียงครั้งเดียว
    });
  }, []);

  /**
   * Handle เมื่อคลิกปุ่ม Signup/Login
   */
  const handleAuthButtonClick = () => {
    setIsAuthModalOpen(true);
  };

  /**
   * Handle เมื่อปิด Auth Modal
   */
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  /**
   * Handle เมื่อ authentication สำเร็จ
   * นำทางไปยังหน้า marketplace
   */
  const handleAuthSuccess = (authenticatedUser) => {
    setIsAuthModalOpen(false);
    navigate("/marketplace");
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50s">
      {/* Hero Section - ส่วนแสดงหัวข้อหลักและปุ่ม auth */}
      <HeroSection onAuthClick={handleAuthButtonClick} />

      <LatestListingsSection
        listings={latestListings}
        isLoading={isLoadingListings}
        error={listingsError}
      />

      <FooterCategories
        categories={categories}
        isLoading={isLoadingCategories}
        error={categoriesError}
      />

      {/* Auth Modal - modal สำหรับ login/signup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthSuccess={handleAuthSuccess}
        setToken={setToken}
        setUsers={setUsers}
        setRole={setRole}
      />

    </div>
  );
}

export default Landing;
