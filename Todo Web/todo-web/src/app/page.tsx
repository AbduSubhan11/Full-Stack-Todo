"use client";
import { GetTodos } from "@/components/get-todos";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([
    { id: 1, title: "Learn Next.js", description: "Study routing and pages" },
    { id: 2, title: "Practice Tailwind", description: "Design a beautiful UI" },
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    GetTodos().then((data) => {
      if (data) {
        setTodos(data);
      }
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newTodo = {
      id: Date.now(),
      title,
      description,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_TODO}/setTodo`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newTodo),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Todos Added Successfully");
        setTodos([...todos, newTodo]);
        setTitle("");
        setDescription("");
      } else {
        console.log(data.message);
      }


    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">My Todos</h1>
        <form onSubmit={handleAdd} className="space-y-4 mb-6">
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
            Add Todo
          </button>
        </form>

        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="border bg-[#2e2d2d] p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">{todo.title}</h3>
                <p className="text-gray-200">{todo.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-blue-400 cursor-pointer">Edit</button>
                <button className="text-red-500 cursor-pointer">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
