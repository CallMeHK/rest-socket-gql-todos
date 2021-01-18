import * as React from 'react'
import useLoading from '../hooks/useLoading'
import useTodos from '../hooks/useTodos'

import TodoElement from './TodoElement'

const TodoList: React.FC = () => {
  const [todoList, setTodoList] = useTodos()
  const [isLoading, setIsLoading] = useLoading()
 

  return (
    <ul id="todo-list">
      {!isLoading &&
        todoList.map(({ id, value }) => (
          <TodoElement todoId={id} todo={value} key={'key' + id} />
        ))}
    </ul>
  )
}

export default TodoList
