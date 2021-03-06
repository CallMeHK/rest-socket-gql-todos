defmodule GenTodoWeb.Router do
  use GenTodoWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/" do
    pipe_through :browser

    get "/", GenTodoWeb.PageController, :index
    get "/rest", GenTodoWeb.RestController, :index
    get "/ws", GenTodoWeb.SocketController, :index
    get "/gql", GenTodoWeb.GqlController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api" do

    pipe_through :api

    forward "/graphiql", Absinthe.Plug.GraphiQL, schema: GenTodoWeb.Schema

    forward "/graph", Absinthe.Plug, schema: GenTodoWeb.Schema

    get "/todos", GenTodoWeb.ValueAPIController, :get_all_values
    post "/todos/create", GenTodoWeb.ValueAPIController, :create_value
    post "/todos/delete", GenTodoWeb.ValueAPIController, :delete_value
    post "/todos/update", GenTodoWeb.ValueAPIController, :update_value
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: GenTodoWeb.Telemetry
    end
  end
end
