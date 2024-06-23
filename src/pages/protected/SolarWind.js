import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import SolarWind from '../../features/dashboard copy 2/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Solar and Wind Page"}))
      }, [])


    return(
        <SolarWind />
    )
}

export default InternalPage