defmodule GenTodoWeb.Resolvers.Values do
  alias GenTodo.Cache

  def list_values(_parent, _args, _resolution) do
    {:ok, Cache.get_all_values()}
  end

  def get_value_by_id(_parent, %{id: id}, _resolution) do
    {:ok, Cache.get_one_value(String.to_integer(id))}
  end

  def create_value(_parent, %{value: value}, _resolution) do
    {:ok, Cache.create_value(value)}
  end

  def delete_value(_parent, %{id: id}, _resolution) do

    {success, _} = Cache.delete_value(id)

    success_obj = case success do
      :ok -> %{success: true}
      :error -> %{success: false}
    end

    {:ok, success_obj}
  end

  def update_value(_parent, %{id: id, value: value}, _resolution) do

    {success, _} = Cache.update_value(id, value)

    success_obj = case success do
      :ok -> %{success: true}
      :error -> %{success: false}
    end

    {:ok, success_obj}
  end



end
