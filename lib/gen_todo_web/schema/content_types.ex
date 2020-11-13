defmodule GenTodoWeb.Schema.ContentTypes do
  use Absinthe.Schema.Notation

  object :value do
    field :id, :id
    field :value, :string
  end

  object :success do
    field :success, :boolean
  end
end
