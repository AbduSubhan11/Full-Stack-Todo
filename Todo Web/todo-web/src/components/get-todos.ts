import { toast } from "react-toastify";

export async function GetTodos() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_TODO}/allTodos`,
      {
        headers: {
          Authorization: `token ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch todos: ${res.status}`);
    }

    const data = await res.json();
    return data.todos;
  } catch (error) {
    toast.error((error as Error).message);
  }
}
