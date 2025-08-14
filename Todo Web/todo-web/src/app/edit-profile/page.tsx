// components/ProfileUpdate.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user || "");

  const route = useRouter();

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [profilePicture, setProfilePicture] = useState("/file.svg");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setProfilePicture(userData.profilePicture);
    setName(userData.name);
    setEmail(userData.email);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      const imgUrl = URL.createObjectURL(e.target.files[0]);
      setProfilePicture(imgUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("profilePicture", selectedFile || "");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_AUTH}/edit-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: formData,
        }
      );

      const updated = await res.json();
      console.log(updated);
      if (!res.ok) {
        toast.error(updated.message);
      }

      toast.success("Profile Updated Succesfully", {
        autoClose: 1500,
      });
      // localStorage.setItem("user", JSON.stringify(updated.user));
      setTimeout(() => {
        route.push("/");
      }, 1500);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
    <ToastContainer/>
      <div className="bg-[#2e2d2d] p-6 rounded shadow max-w-3xl w-96 mx-auto mb-8">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center gap-4">
            <Image
              src={profilePicture}
              alt="Profile"
              width={70}
              height={70}
              className="rounded-full object-cover border border-gray-500"
            />
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer text-sm">
              Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-500 bg-[#1f1f1f] text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-500 bg-[#1f1f1f] text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
