"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Signup() {
  const route = useRouter()
  const [formData, setFormData] = useState({email : "", password: "", name: ""});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    e.stopPropagation()
    setFormData((prev)=> ({...prev, [e.target.name] : e.target.value}))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_AUTH}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    toast.error(data)
    if (!res.ok) {
      toast.error(data.message || "Signup Failed ");
      return;
    }

    toast.success("Signup Successfull")
    setTimeout(()=>{
      route.push("/login")
    },1500)


  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <ToastContainer/>
      <div className="p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center" >Sign Up</h2>
        <form  onSubmit={handleSubmit}  className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function async(arg0: () => void) {
  throw new Error("Function not implemented.");
}
