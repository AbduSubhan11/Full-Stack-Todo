"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { toast, ToastContainer } from "react-toastify";

function VerifyEmail() {
  const path = usePathname();
  const token = path.split("/").pop();

  const handleVerifyEmail = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_AUTH}/verify-email/${token}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("Verification response:", res);
      if (!res.ok) {
        return toast.error(data.message || "Verification Failed");
      }
      toast.success("Email verified successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      toast.error("Verification failed. Please try again later.");
      console.error("Verification error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg- shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Verify Your Email
        </h2>
        <p className="text-white mb-6">
          Click the button below to verify your email address.
        </p>
      
        <button
          onClick={handleVerifyEmail}
          className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Verify Email
        </button>

        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}

export default VerifyEmail;
