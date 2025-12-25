import { createContext, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../config/api'

const checkInContext = createContext()
function CheckInContextProvider({children}) {

  const [checkInDataList, setCheckInDataList] = useState([])
    
  const handleDelete = async (id) => {
    
        try {
            console.log("Deleting check-in with id:", id)
            const response = await axios.delete(`${API_URL}/checkin/${id}/`)
            setCheckInDataList(prevList => prevList.filter(item => item.id !== id));
            if (response.ok) {
                console.log("Deleted successfully")
                
            }
        } catch (error) {
            console.log("Error deleting check-in:", error)
        }
    }
  
  return (
    <>
    <checkInContext.Provider value={{checkInDataList, setCheckInDataList,handleDelete}}>
        {children}
      </checkInContext.Provider>
    </>
  )
}

export default CheckInContextProvider
export {checkInContext}