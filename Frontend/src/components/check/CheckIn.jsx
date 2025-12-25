import { useContext, useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import CheckInData from './CheckInData'
import Button from '../Button'
import {checkInContext} from './CheckInContextProvider'
import { useAuth } from '../auth/AuthContext'
import { API_URL } from '../../config/api'

function CheckIn() {
  const { state } = useLocation()
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const { isAuthenticated } = useAuth()

  const { checkInDataList , setCheckInDataList,handleDelete } = useContext(checkInContext)
  const navigate = useNavigate()

  const checkInDataBackend = {
    reason: reason,
    notes: notes,
    mood: state?.selectMood?.emojis,
    color: state?.selectMood?.color
  }
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      document.getElementById('login_modal').showModal();
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/checkin/`, checkInDataBackend);
      console.log('Check-in saved successfully:', response.data);
      setCheckInDataList(prevList => [response.data, ...prevList]);
      setReason('')
      setNotes('')
      state?.selectMood('')
    }
    catch (error) {
      console.log("Errors", error)
    }
  }


  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/checkin/`)
        console.log(response.data)
        setCheckInDataList(response.data)
        console.log("Fetched check-in history successfully")
      } catch (error) {
        console.log("Errors", error.response?.data)
      }
    }
    fetchData()
  }, [isAuthenticated])
  return (
    <>

      <div className='flex flex-col items-center mt-10 pb-5 px-4 md:px-0'>
        {/* Added max-w-lg to the container and adjusted padding */}
        <div style={{ backgroundColor: state?.selectMood?.color }} className="rounded-lg shadow-lg shadow-green-200/50 p-5 md:p-8 w-full max-w-lg">
          <h1 className='text-2xl md:text-4xl font-bold tracking-wide text-green-600/70 text-center'>Check-in Reflection</h1>
          {/* Adjusted font sizes for responsiveness */}
          <p className='mt-5 my-3 text-lg md:text-2xl font-semibold tracking-wide flex gap-2 items-center justify-center text-center'>Mood Selected: {state?.selectMood ?
            (
              <span className='text-3xl md:text-4xl'>{state.selectMood.emojis.split(' ')[0]}<span className='text-darkGreen text-xl md:text-3xl font-semibold ml-2 opacity-90'>{state.selectMood.emojis.split(' ')[1]}</span></span>) :
            (<Link to="/#checkInSection" className='text-red-400 text-[12px] hover:text-blue-600'>Go back and choose how you feel first.</Link>)}</p>
          {state?.selectMood?.quotes ? (<p className='text-center text-gray-700 font-semibold text-sm md:text-md italic'>"{state.selectMood.quotes}"</p>) : ""}
          <form className='flex flex-col gap-5 border-t border-gray-400 mt-7 pt-7' action="">
            <label className="text-sm md:text-base">What made you feel this way?</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} className='border border-primarySoftGreen focus:outline-darkGreen/60 w-full h-10  rounded-lg p-3' type="text" />
            <label className="text-sm md:text-base">Anything you'd like to document?</label>
            {/* Uses full width w-full */}
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className='border border-primarySoftGreen h-15 focus:outline-darkGreen/60 rounded-lg p-3 w-full' type="textarea" />
            <input type="submit" onClick={handleSave} value="Save Check-in" className='mt-2 self-center px-3 py-1.5 rounded-lg bg-lighterGreen hover:bg-darkGreen hover:text-white font-semibold cursor-pointer' />
          </form>
        </div>
      </div>
      {checkInDataList.length > 0 &&<div>
        <div className="flex justify-center mt-10 px-4">
          <h1 className="text-darkGreen text-3xl md:text-4xl font-semibold text-center">Your Previous Check-Ins</h1>
        </div>

        <div className='px-4 md:px-0'>
          {checkInDataList.slice(0, 2).map((item, index) => (
            <CheckInData key={index} id={item.id} modalId={`notes_modal_${index}`} emoji={item.mood} reason={item.reason} notes={item.notes} color={item.color} time={item.created_at} onDelete={handleDelete} />
          ))}
        </div>
        <div className='text-center'>
          <Button text="See All Check-Ins" class="mt-5 mb-10 px-3 py-1.5 rounded-lg bg-lighterGreen hover:bg-darkGreen hover:text-white font-semibold" click={() => navigate('/checkInHistory')} />
        </div>
      </div>}
    </>
  )

}
export default CheckIn
