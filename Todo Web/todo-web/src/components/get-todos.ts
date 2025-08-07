export async function GetTodos() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_TODO}/allTodos`, {
      headers: {
        Authorization: `token ${localStorage.getItem("token")}`,
      },
      credentials: "include",
    });

    const todos = await res.json();
    return todos;
  } catch (error) {
    return error;
  }
}
