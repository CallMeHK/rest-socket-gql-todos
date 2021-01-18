import { atom } from 'recoil'

export type Todo = {
  id: string
  value: string
}

const todos = atom<Todo[]>({
  key: 'todos',
  default: [],
})

const loading = atom<boolean>({
  key: 'loading',
  default: true,
})

const recoil = {
  todos,
  loading
}

export default recoil