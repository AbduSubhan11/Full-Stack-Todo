"use client";
import { GetTodos } from "@/components/get-todos";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

type todo = {
  title: string;
  description: string;
  _id: string;
};

export default function Home() {
  if (typeof window === "undefined") return;
  const route = useRouter();

  const user = localStorage.getItem("user");
  const userData = JSON.parse(user || "");

  const [todos, setTodos] = useState<todo[]>([]);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [todoToDelete, SetTodoToDelete] = useState<todo | null>();
  const [isEditMode, SetIsEditMode] = useState(false);
  const [editTodoId, setEditTodoId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    GetTodos().then((data) => {
      if (data) {
        setTodos(data);
      }
    });
  }, [isEditMode]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please Provide All Fields");
      return;
    }

    const newTodo = {
      title,
      description,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_TODO}/setTodo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify(newTodo),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      }

      toast.success("Todos Added Successfully");
      setTodos([...todos, data.todo]);
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error("ID is required");
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_TODO}/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      const delTodo = await res.json();

      if (!res.ok) {
        toast.error(delTodo.message);
      }

      toast.success("Todo Deleted Successfully", {
        autoClose: 1500,
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      setShowDeletePopup(false);
      SetTodoToDelete(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const EditTodo = {
      title,
      description,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_TODO}/update/${editTodoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify(EditTodo),
        }
      );

      const editedTodo = await res.json();
      if (!res.ok) {
        toast.error(editedTodo.message);
      }

      toast.success("Todo Edited Successfully", {
        autoClose: 1500,
      });

      setTodos((prev) =>
        prev.map((t) =>
          t._id === editTodoId && editedTodo.todo ? editedTodo.todo : t
        )
      );

      SetIsEditMode(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleLogout = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_AUTH}/logout/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      const delTodo = await res.json();
      if (!res.ok) {
        toast.error(delTodo.message);
      }

      toast.success("Logout Succesffuly", {
        autoClose: 2000,
      });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      route.push("/login");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Profile Header */}
      <div className="bg-[#2e2d2d] p-4 rounded flex justify-between items-center mb-6 shadow">
        <div className="flex items-center gap-5 ">
          <h2 className="text-lg font-semibold text-white">Welcome back </h2>
          <p className="text-blue-400 font-bold">
            {userData.name[0].toUpperCase()}
            {userData.name.slice(1)} 👋
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={"/edit-profile"}>
            <Image
              alt="Profile Image"
              src={userData.profilePicture}
              width={40}
              height={40}
              className="rounded-full"
            ></Image>
          </Link>
          <button
            onClick={() => handleLogout(userData._id)}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <ToastContainer />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">My Todos</h1>
        <form
          onSubmit={(e) => (isEditMode ? handleEdit(e) : handleAdd(e))}
          className="space-y-4 mb-6"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          ></textarea>
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isEditMode ? "Edit" : "Add"} Todo
          </button>
        </form>

        <ul className="space-y-4 ">
          {todos.length > 0 ? (
            <>
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="border bg-[#2e2d2d] p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{todo.title}</h3>
                    <p className="text-gray-200">{todo.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setTitle(todo.title);
                        setDescription(todo.description);
                        SetIsEditMode(true);
                        setEditTodoId(todo._id);
                      }}
                      className="text-blue-400 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowDeletePopup(true);
                        SetTodoToDelete(todo);
                      }}
                      className="text-red-500 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </>
          ) : (
            <p className="text-center">No todos found</p>
          )}
        </ul>
        {showDeletePopup && todoToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="bg-[#2e2c2c] rounded p-6 max-w-sm w-full shadow-lg">
              <h2 className="text-xl font-semibold mb-4 ">Confirm Delete</h2>
              <p>Are you sure you want to delete "{todoToDelete?.title}"?</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="px-4 py-2 cursor-pointer bg-gray-300 text-black rounded hover:bg-gray-400"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleDelete(todoToDelete._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
