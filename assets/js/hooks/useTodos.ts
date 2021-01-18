import { useRecoilState } from 'recoil'
import recoil from '../recoil/atoms'

const useTodos = () => useRecoilState(recoil.todos)

export default useTodos