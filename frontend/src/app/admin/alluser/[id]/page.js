"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../../utils/axiosInstance";

const ViewUserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/me/${id}`);
        setUser(data.user);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <div className="p-6 text-gray-500">Loading user...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-xl rounded-2xl">
      <h1 className="text-xl font-bold mb-4">{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Mobile: {user.mobile}</p>
      <p>Address: {user.address}</p>
      <p>District: {user.district}</p>
      <p>Designation: {user.designation}</p>
      <p>Gender: {user.gender}</p>
      <p>DOB: {user.dob}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.isActive ? "Active" : "Inactive"}</p>
    </div>
  );
};

export default ViewUserPage;