import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import WindPage from '../../features/dashboard copy/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Wind Page"}))
      }, [])


    return(
        <WindPage />
    )
}

export default InternalPage