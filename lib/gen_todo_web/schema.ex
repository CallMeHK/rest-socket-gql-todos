defmodule GenTodoWeb.Schema do
  use Absinthe.Schema
  import_types GenTodoWeb.Schema.ContentTypes

  alias GenTodoWeb.Resolvers

  query do
    @desc "Get all values"
    field :values, list_of(:value) do
      resolve &Resolvers.Values.list_values/3
    end

    # Add this field:
    @desc "Get one value"
    field :value, :value do
      arg :id, non_null(:id)
      resolve &Resolvers.Values.get_value_by_id/3
    end
  end


  mutation do
    @desc "Create a value"
    field :create_value, type: :value do
      arg :value, non_null(:string)

      resolve &Resolvers.Values.create_value/3
    end
    @desc "Delete a value"
    field :delete_value, type: :success do
      arg :id, non_null(:integer)

      resolve &Resolvers.Values.delete_value/3
    end

    @desc "Update a value"
    field :update_value, type: :success do
      arg :id, non_null(:integer)
      arg :value, non_null(:string)

      resolve &Resolvers.Values.update_value/3
    end

  end
end
