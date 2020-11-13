defmodule GenTodo.Cache do
  use GenServer

  def get_all_values do
    GenServer.call(:cache, {:get})
  end

  def get_one_value(id) do
    GenServer.call(:cache, {:get_one, id})
  end

  def create_value(value) do
    GenServer.call(:cache, {:create, value})
  end

  def delete_value(id) do
    GenServer.call(:cache, {:delete, id})
  end

  def update_value(id, value) do
    GenServer.call(:cache, {:update, %{id: id, value: value}})
  end


  def start_link(_) do
    GenServer.start_link(__MODULE__, {0, []}, name: :cache)
  end


  def init(args) do
    {:ok, args}
  end

  def handle_call({:get}, _from, { _pki, state} = complete_state) do
    {:reply, state, complete_state}
  end

  def handle_call({:get_one, id_to_get}, _from, { _pki, state} = complete_state) do
    IO.puts id_to_get
    value = Enum.find(state, fn(%{id: id, value: _value} ) ->
      id == id_to_get
    end)
    {:reply, value, complete_state}
  end

  def handle_call( {:create, new_value}, _from,  {pki, state} ) do
    new_value_struct = %{ id: pki , value: new_value}
    {:reply,
    new_value_struct,
     {pki + 1, state ++ [new_value_struct]}}
  end

  def handle_call({:delete, delete_value_id}, _from, { pki, state} = _complete_state) do

    contains_value = Enum.find(state, fn(%{id: id, value: _value} ) ->
      id == delete_value_id end)

    new_state = case contains_value do
      nil -> state
      _ -> Enum.filter(state,
        fn(%{id: id, value: _value}) -> id != delete_value_id end)
    end

    success = if (contains_value != nil), do: :ok, else: :error

    {:reply, { success, new_state }, { pki, new_state}}
  end

  def handle_call(
   {:update, %{id: update_value_id, value: _updated_value} = full_updated_value},
   _from,
   { pki, state} = _complete_state) do

    contains_value = Enum.find(state, fn(%{id: id, value: _value} ) ->
      id == update_value_id end)

    new_state = case contains_value do
      nil -> state
      _ -> Enum.map(state,
          fn(%{id: id, value: _value} = full_value) ->
          if (id != update_value_id), do: full_value, else: full_updated_value end)
    end

    success = if (contains_value != nil), do: :ok, else: :error

   {:reply, { success, new_state}, { pki, new_state}}
  end
end
