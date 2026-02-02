import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1121] transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Top Header - Fixed */}
      <Header />

      {/* Main Content Wrapper */}
      <div className="md:pl-64 flex flex-col min-h-screen transition-[padding] duration-300">
        <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-24 pb-32 md:pb-8">
          {children}
        </div>
      </div>

      {/* Bottom Nav - Mobile */}
      <BottomNav />
    </div>
  );
};

export default AppLayout;
