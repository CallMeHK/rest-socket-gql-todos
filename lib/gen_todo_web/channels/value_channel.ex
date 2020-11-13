defmodule GenTodoWeb.ValueChannel do
  use Phoenix.Channel
  alias GenTodo.Cache

  def join("values:public", _message, socket) do
    {:ok, socket}
  end

  def join("values:" <> _private_values_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end



  def handle_in("get_all_values", _body, socket) do
    all_values = Cache.get_all_values()

    {:reply,{ :ok, %{ allValues: all_values} }, socket}
  end

  def handle_in("create_value", %{"value" => value}, socket) do
    created = Cache.create_value(value)
    broadcast_from(socket, "event:create_value", created)

    {:reply,{ :ok, created }, socket}
  end

  def handle_in("delete_value", %{"id" => id}, socket) do
    response = case Cache.delete_value(id) do
      {:ok, _} -> %{success: true, deleted: id}
      {:error, _} -> %{success: false}
    end

    if(response.success) do broadcast_from(socket, "event:delete_value", response) end

    {:reply,{ :ok, response }, socket}
  end

  def handle_in("update_value", %{"id" => id, "value" => value}, socket ) do
    {success, _new_state} = Cache.update_value(id, value)

    response = case success do
      :ok -> %{success: true,  updated: %{id: id, value: value}}
      :error -> %{success: false}
    end

    if(response.success) do broadcast_from(socket, "event:update_value", response) end

    {:reply,{ :ok, response }, socket}
  end

end
