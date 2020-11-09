defmodule GenTodoWeb.RestController do
  use GenTodoWeb, :controller
  alias GenTodo.Cache

  def index(conn, _params) do
    todos = Cache.get_all_values()
    IO.inspect todos
    render(conn, "index.html", %{ todos: Cache.get_all_values() })
  end
end
