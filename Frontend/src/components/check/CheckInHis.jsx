
import CheckInData from './CheckInData'
import { useContext, useEffect, useState } from "react";
import { checkInContext } from "./CheckInContextProvider";
import { useAuth } from "../auth/AuthContext";
import axios from 'axios';
import Button from '../Button';
import { API_URL } from '../../config/api';

function CheckInHis() {
    const {checkInDataList , setCheckInDataList, handleDelete} = useContext(checkInContext)
    const [filter, setFilter] = useState('quick'); // null, 'quick', 'full'
    const [quickCheckins, setQuickCheckins] = useState([]);
    const { isAuthenticated } = useAuth();
    
    useEffect(() => {
        if (!isAuthenticated) return;
        
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/checkin/`)
                console.log('Fetched data:', response.data)
                setCheckInDataList(response.data)
                
                // Fetch quick check-ins
                const quickResponse = await axios.get(`${API_URL}/checkin/quick/`)
                setQuickCheckins(quickResponse.data)
            } catch (error) {
                console.log("Error fetching check-ins:", error)
            }
        }
        fetchData()
    }, [isAuthenticated])
    
    // Filter logic: only show data when filter is selected
    const filteredData = filter === 'full' ? checkInDataList : [];
    
    return (
        <>
            <div className="flex flex-col items-center mt-10 px-4">
                <h1 className="text-darkGreen text-3xl md:text-4xl font-semibold mb-6">Your Check-Ins History</h1>
                
                {!isAuthenticated ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-4">Please login to view your check-in history</p>
                        <Button 
                            text="Login" 
                            class="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
                            click={() => document.getElementById('login_modal').showModal()}
                        />
                    </div>
                ) : (
                    <>
                        {/* Filter Toggle */}
                        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
                            <Button 
                                text="Quick" 
                                class={`px-4 py-2 rounded-md transition-all ${filter === 'quick' ? 'bg-darkGreen text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
                                click={() => setFilter('quick')}
                            />
                            <Button 
                                text="Full" 
                                class={`px-4 py-2 rounded-md transition-all ${filter === 'full' ? 'bg-darkGreen text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
                                click={() => setFilter('full')}
                            />
                        </div>
                    </>
                )}
            </div>
            
            {/* Only show check-ins if authenticated */}
            {isAuthenticated && (
                <>
                    {/* Quick Check-ins - only show when filter is 'quick' */}
                    {filter === 'quick' && (
                        <div className="px-4">
                            {quickCheckins.length === 0 ? (
                                <p className="text-center text-gray-500">No quick check-ins yet</p>
                            ) : (
                                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {quickCheckins.map((item, index) => (
                                        <div key={index} className="relative bg-white border border-lighterGreen rounded-lg p-4 shadow-sm">
                                            <Button 
                                                class="absolute bottom-2 right-2 rounded-lg hover:bg-red-600 hover:shadow-sm shadow-gray-700/50 p-1 bg-red-600/70" 
                                                click={async () => {
                                                    try {
                                                        await axios.delete(`${API_URL}/checkin/quick/${item.id}/`);
                                                        setQuickCheckins(prevList => prevList.filter(q => q.id !== item.id));
                                                    } catch (error) {
                                                        console.log("Error deleting quick check-in:", error);
                                                    }
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </Button>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-3xl">{item.mood}</span>
                                                <span className="text-xs text-gray-500">{item.created_at}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">Intensity:</span>
                                                    <span className="text-sm font-semibold text-darkGreen">{item.intensity}/10</span>
                                                </div>
                                                {item.note && (
                                                    <p className="text-sm text-gray-700">{item.note}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Full Check-ins */}
                    {filter === 'full' && (
                        <>
                            {filteredData.map((item, index) => (
                                <CheckInData 
                                    key={index} 
                                    id={item.id} 
                                    modalId={`notes_modal_${index}`} 
                                    emoji={item.mood} 
                                    reason={item.reason} 
                                    notes={item.notes} 
                                    color={item.color} 
                                    time={item.created_at}  
                                    onDelete={handleDelete} 
                                />
                            ))}
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default CheckInHis