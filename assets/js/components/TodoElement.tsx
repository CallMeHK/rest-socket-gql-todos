import * as React from 'react'

const TodoElement: React.FC<{ todoId: number; todo: string }> = ({
  todoId,
  todo,
}) => {
  return <li style={{ cursor: 'pointer'}} id={todoId.toString()}>{todo}</li>
}

export default TodoElement

{
  /* <%= for %{id: id, value: todo} <- @todos do %>
    <li id=<%= id %> style="cursor: pointer">
      <%= todo %>
    </li>
  <% end %> */
}
