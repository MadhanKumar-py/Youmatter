import { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from '../Button'
import { checkInContext } from './CheckInContextProvider'
import { API_URL } from '../../config/api'

function CheckInUpdate() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { checkInDataList, setCheckInDataList } = useContext(checkInContext)

    const [reason, setReason] = useState(state?.item?.reason || '')
    const [notes, setNotes] = useState(state?.item?.notes || '')

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const updatedData = {
                reason: reason,
                notes: notes,
                mood: state?.item?.mood,
                color: state?.item?.color
            }
            const response = await axios.put(`${API_URL}/checkin/${state?.item?.id}/`, updatedData)
            console.log('Check-in updated successfully:', response.data)
            setCheckInDataList(prevList => 
                prevList.map(item => item.id === state?.item?.id ? response.data : item)
            )
            navigate('/checkInHistory')
        } catch (error) {
            console.log("Error updating check-in:", error)
        }
    }

    return (
        <>
            <div className='flex flex-col items-center mt-10 pb-5 px-4 md:px-0'>
                <div style={{ backgroundColor: state?.item?.color }} className="rounded-lg shadow-lg shadow-green-200/50 p-5 md:p-8 w-full max-w-lg">
                    <h1 className='text-2xl md:text-4xl font-bold tracking-wide text-green-600/70 text-center'>Update Check-in</h1>
                    <p className='mt-5 my-3 text-lg md:text-2xl font-semibold tracking-wide flex gap-2 items-center justify-center text-center'>
                        Mood: <span className='text-3xl md:text-4xl'>{state?.item?.mood?.split(' ')[0]}<span className='text-darkGreen text-xl md:text-3xl font-semibold ml-2 opacity-90'>{state?.item?.mood?.split(' ')[1]}</span></span>
                    </p>
                    <form className='flex flex-col gap-5 border-t border-gray-400 mt-7 pt-7' action="">
                        <label className="text-sm md:text-base">What made you feel this way?</label>
                        <input 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)} 
                            className='border border-primarySoftGreen focus:outline-darkGreen/60 w-full h-10 rounded-lg p-3' 
                            type="text" 
                        />
                        <label className="text-sm md:text-base">Anything you'd like to document?</label>
                        <input 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)} 
                            className='border border-primarySoftGreen h-15 focus:outline-darkGreen/60 rounded-lg p-3 w-full' 
                            type="textarea" 
                        />
                        <div className='flex gap-3 justify-center'>
                            <input 
                                type="submit" 
                                onClick={handleUpdate} 
                                value="Update Check-in" 
                                className='mt-2 px-3 py-1.5 rounded-lg bg-lighterGreen hover:bg-darkGreen hover:text-white font-semibold cursor-pointer' 
                            />
                            <Button 
                                text="Cancel" 
                                class='mt-2 px-3 py-1.5 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold' 
                                click={() => navigate('/checkInHistory')} 
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CheckInUpdate
