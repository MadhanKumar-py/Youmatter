import React from 'react'
import Button from '../Button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CheckInData(props) {
    const { id , emoji, reason, notes, color, time, modalId, onDelete } = props
    const navigate = useNavigate()
    
    const handleEdit = () => {
        navigate('/checkInUpdate', { 
            state: { 
                item: { 
                    id, 
                    mood: emoji, 
                    reason, 
                    notes, 
                    color, 
                    created_at: time 
                } 
            } 
        })
    }

    // const handleDelete = async () => {
    //     try {
    //         console.log("Deleting check-in with id:", id)
    //         const response = await axios.delete(`http://localhost:8000/api/checkin/${id}/`)
    //         if (response.ok) {
    //             console.log("Deleted successfully")
                
    //         }
    //         onDelete?.(id)
    //     } catch (error) {
    //         console.log("Error deleting check-in:", error)
    //     }
    // }
    return (
        <>
            <div className="mt-10 mb-3">
                <div className="flex flex-col items-center mt-8 min-[320px]:items-center">
                    <div style={{ backgroundColor: color }} className="relative border py-2 px-5 w-full sm:w-10/12 md:w-8/12 lg:w-4/12 flex gap-3 flex-col rounded-lg shadow-lg bg-green-50/60">
                        <Button class="rounded-lg hover:bg-blue-600 hover:shadow-sm shadow-gray-700/50 p-1 bg-blue-600/70 absolute top-3 right-3" click={handleEdit} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="text-green-600 font-semibold text-xl ">{emoji}<span className="text-black"> •</span></div>
                            <div className="text-sm md:text-base font-semibold text-gray-700">{time}</div>
                        </div>
                        <div className="text-lg md:text-xl font-semibold">{reason}</div>
                        {notes ?
                            (<Button text="Show notes ▾" class="border mb-2 px-2 py-2 font-semibold self-start bg-darkGreen/80 text-white rounded-lg text-sm md:text-base" click={() => {
                                document.getElementById(modalId).showModal();

                            }} />) : <p className='text-gray-600 font-semibold mb-2 text-sm md:text-base'>No Notes</p>}
                        <dialog id={modalId} className="modal">
                            <div className="modal-box border border-darkGreen/70 bg-green-50 shadow-lg shadow-gray-800/50">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <div className="flex items-center gap-2">
                                    <div className="text-green-600 font-semibold text-xl">{emoji}<span className="text-black"> •</span></div>
                                    <div className="text-sm md:text-base">{time}</div>
                                </div>
                                <p className="py-4 text-sm md:text-base">{notes}</p>
                            </div>
                        </dialog>
                        <Button class="rounded-lg hover:bg-red-600 hover:shadow-sm shadow-gray-700/50 p-1 bg-red-600/70 absolute bottom-3 right-3" click={()=>onDelete(id)} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </Button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckInData;
