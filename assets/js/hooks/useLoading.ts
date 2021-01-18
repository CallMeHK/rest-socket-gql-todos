import { useRecoilState } from 'recoil'
import recoil from '../recoil/atoms'

const useLoading = () => useRecoilState(recoil.loading)

export default useLoading