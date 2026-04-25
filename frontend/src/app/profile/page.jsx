"use client";

import GetUser from "../components/Signup/GetUser";
import UpdatePassword from "../components/Signup/UpdatePassword";
import UpdateProfile from "../components/Signup/UpdateProfile";

function Profile() {
  return (
    <div className="relative min-h-screen -mt-16 py-12 px-4 overflow-hidden dark:bg-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br -mt-16 from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 animate-gradient-bg -z-10" />

      {/* Page Wrapper */}
      <div className="max-w-2xl -mt-13 mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            Account Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2 text-sm md:text-base leading-relaxed">
            Manage your profile, password & personal information
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12 -mt-10  ">
          {/* User Info */}
          <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-10px_rgba(255,255,255,0.05)] border border-white/20 dark:border-gray-700 p-6 transition-all hover:-translate-y-1 hover:shadow-[0_35px_80px_-10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_35px_80px_-10px_rgba(255,255,255,0.05)]">
            <GetUser />
          </section>

          {/* Update Profile */}
          <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-10px_rgba(255,255,255,0.05)] border border-white/20 dark:border-gray-700 p-6 transition-all hover:-translate-y-1 hover:shadow-[0_35px_80px_-10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_35px_80px_-10px_rgba(255,255,255,0.05)]">
            <UpdateProfile />
          </section>

          {/* Update Password */}
          <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-10px_rgba(255,255,255,0.05)] border border-white/20 dark:border-gray-700 p-6 transition-all hover:-translate-y-1 hover:shadow-[0_35px_80px_-10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_35px_80px_-10px_rgba(255,255,255,0.05)]">
            <UpdatePassword />
          </section>
        </div>
      </div>

      
    </div>
  );
}

export default Profile;
