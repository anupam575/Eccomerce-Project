"use client";
import Middle from "./components/Home/Middle"; 
import CategorySection from "./components/Home/CategorySection";
import FeaturedProducts from "./components/Home/FeaturedProducts";
import Footer from "./components/Home/Footer";

export default function HomePage() {

    return (
        <div>
            <Middle />
            <CategorySection />
            <FeaturedProducts />
            <Footer />
        </div>
    );
}


// "use client";

// import { useState } from "react";
// import { toast } from "react-toastify";
// import API from "../utils/axiosInstance";
// import AllRole from "./components/Section/Allrole";

// const CreateRole = () => {
//   const [roleName, setRoleName] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   // ✅ strict regex
//   const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

//   // ================= INPUT CHANGE =================
//   const handleChange = (e) => {
//     const value = e.target.value;

//     // ❌ block invalid typing (numbers + special chars)
//     if (value && !/^[A-Za-z\s]*$/.test(value)) {
//       setError("Only letters and spaces allowed");
//       return;
//     }

//     setRoleName(value);

//     // ✅ live validation
//     if (!value.trim()) {
//       setError("Role name is required");
//     } else if (!nameRegex.test(value.trim())) {
//       setError("Invalid format (no extra spaces)");
//     } else {
//       setError("");
//     }
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const trimmed = roleName.trim();

//     if (!trimmed) {
//       toast.warn("Role name is required");
//       return;
//     }

//     if (!nameRegex.test(trimmed)) {
//       toast.error("Only letters and single spaces allowed");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await API.post("/roles/create", {
//         role_name: trimmed,
//       });

//       if (res.data.success) {
//         toast.success("Role created successfully 🎉");

//         setRoleName("");
//         setError("");

//         // 🔄 refresh list
//         setRefreshKey((prev) => prev + 1);
//       }

//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to create role");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       {/* HEADER */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           Role Management
//         </h2>
//         <p className="text-sm text-gray-500">
//           Create and manage system roles
//         </p>
//       </div>

//       {/* CREATE CARD */}
//       <div className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">
//           Create New Role
//         </h3>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col sm:flex-row gap-3"
//         >
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Enter role name..."
//               value={roleName}
//               onChange={handleChange}
//               className={`
//                 w-full px-4 py-2 rounded-lg border
//                 ${error ? "border-red-500" : "border-gray-300"}
//                 focus:outline-none focus:ring-2 focus:ring-blue-500
//               `}
//             />

//             {/* ERROR */}
//             {error && (
//               <p className="text-red-500 text-sm mt-1">{error}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading || !!error}
//             className={`
//               bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition
//               ${loading || error ? "opacity-50 cursor-not-allowed" : ""}
//             `}
//           >
//             {loading ? "Creating..." : "Create Role"}
//           </button>
//         </form>
//       </div>

//       {/* ROLE LIST */}
//       <div className="bg-white shadow-md rounded-xl border border-gray-200 p-4">
//         <AllRole key={refreshKey} />
//       </div>
//     </div>
//   );
// };

// export default CreateRole;