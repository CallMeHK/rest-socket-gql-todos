defmodule GenTodoWeb.GqlController do
  use GenTodoWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
