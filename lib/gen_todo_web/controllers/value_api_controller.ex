defmodule GenTodoWeb.ValueAPIController do
  use GenTodoWeb, :controller
  alias GenTodo.Cache

  def get_all_values(conn, _params) do
    conn
    |> json(Cache.get_all_values())
  end

  def create_value(conn, body) do
    created = Cache.create_value(body["value"])
    conn
    |> json(created)
  end

  def delete_value(conn, body) do
    response = case Cache.delete_value(body["id"]) do
      {:ok, _} -> %{success: true, deleted: body["id"]}
      {:error, _} -> %{success: false}
    end
    conn
    |> json(response)
  end

  def update_value(conn, body) do

    {success, _new_state} = Cache.update_value(body["id"], body["value"])

    response = case success do
      :ok -> %{success: true,  updated: %{id: body["id"], value: body["value"]}}
      :error -> %{success: false}
    end

    conn
    |> json(response)
  end

end
