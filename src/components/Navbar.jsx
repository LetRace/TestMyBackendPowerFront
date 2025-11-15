// components/Navbar.jsx (Refactored)
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatModal from "./chat/ChatModal";
import NavbarLogo from "./navbar/NavbarLogo";
import NavbarLinks from "./navbar/NavbarLinks";
import NavbarActions from "./navbar/NavbarActions";
import MobileDrawer from "./navbar/MobileDrawer";
import AuthModal from "./AuthModal";

function Navbar({ role, setToken, setRole, setUsers }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


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

  const {
    showChat,
    setShowChat,
    conversations,
    selectedConversation,
    messages,
    input,
    setInput,
    unreadCount,
    loading,
    currentUserId,
    handleChatClick,
    handleConversationSelect,
    sendMessage,
    fetchConversations
  } = useChat(role);

  const token = localStorage.getItem('token')

  return (
    <>
      <nav className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <NavbarLogo />

            {/* Center: Navigation Links (Desktop) */}
            <NavbarLinks role={role} />

            {token === null ? (
              <button
                onClick={handleAuthButtonClick}
                className="border-2 border-blue-700 text-blue-700 px-4 py-2 rounded-full shadow hover:scale-110 hover:shadow-xl transition text-sm font-semibold"
              >
                Signup / Login
              </button>
            ) : (
              <NavbarActions
                role={role}
                unreadCount={unreadCount}
                menuOpen={menuOpen}
                onChatClick={handleChatClick}
                onMenuToggle={() => setMenuOpen(!menuOpen)}
              />
            )}
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={handleCloseAuthModal}
              onAuthSuccess={handleAuthSuccess}
              setToken={setToken}
              setUsers={setUsers}
              setRole={setRole}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        role={role}
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChat}
        conversations={conversations}
        selectedConversation={selectedConversation}
        messages={messages}
        input={input}
        loading={loading}
        currentUserId={currentUserId}
        onClose={() => setShowChat(false)}
        onSelectConversation={handleConversationSelect}
        onInputChange={setInput}
        onSendMessage={sendMessage}
        fetchConversations={fetchConversations}
      />
    </>
  );
}

export default Navbar;