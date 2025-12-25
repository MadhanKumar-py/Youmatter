import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { useAuth } from '../auth/AuthContext';
import { API_URL } from '../../config/api';

function QuickCheckInPreview() {
  const [recentCheckins, setRecentCheckins] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchRecent = async () => {
      try {
        const response = await axios.get(`${API_URL}/checkin/quick/`);
        setRecentCheckins(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recent quick check-ins:', error);
      }
    };
    fetchRecent();
  }, [isAuthenticated]);

  // Don't show anything if not authenticated or no check-ins
  if (!isAuthenticated || recentCheckins.length === 0) return null;

  return (
    <div className="my-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-darkGreen">Recent Quick Check-ins</h2>
          <Button 
            text="View All" 
            class="text-sm px-3 py-1 border border-darkGreen text-darkGreen hover:bg-lighterGreen rounded-md"
            click={() => navigate('/checkInHistory')}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentCheckins.map((checkin) => (
            <div 
              key={checkin.id} 
              className="bg-white border border-lighterGreen rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{checkin.mood}</span>
                <span className="text-xs text-gray-500">{checkin.created_at}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Intensity:</span>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-4 rounded-sm ${i < checkin.intensity ? 'bg-green-500' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-darkGreen">{checkin.intensity}/10</span>
                </div>
                {checkin.note && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{checkin.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuickCheckInPreview;
