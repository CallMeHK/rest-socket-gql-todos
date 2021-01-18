import * as React from 'react'
import TodoList from './components/TodoList'
import useLoading from './hooks/useLoading'
import useTodos from './hooks/useTodos'
import { Todo } from './recoil/atoms'
import todosService from './services/request.service'

const App: React.FC = () => {
  const [todoList, setTodoList] = useTodos()
  const [isLoading, setIsLoading] = useLoading()

  React.useEffect(() => {
    ;(async () => {
      const response = await todosService.getAll()
      setTodoList(response.values)
      setIsLoading(false)
    })()
  }, [])

  const createTodo = React.useCallback(async (value: string) => {
    const response = await todosService.create(value)
    setTodoList((old: Todo[]) => [...old, response.createValue])
  }, [])

  return (
    <>
      <section className="phx-hero">
        <h1>GQL Todo Example</h1>
        <p>
          This is an example using GQL, phoenix absinthe, and
          react. right click a todo to delete, left click a todo
          to edit.
        </p>
      </section>

      <h2>Todos</h2>
      <div>
        <label>Add a todo</label>
        <input id="todo-creator"  />
      </div>
      <TodoList />
    </>
  )
}

export default App
