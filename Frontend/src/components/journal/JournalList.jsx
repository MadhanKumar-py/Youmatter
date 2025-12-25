import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Button';
import { useAuth } from '../auth/AuthContext';
import { API_URL } from '../../config/api';

function JournalList() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchEntries();
  }, [isAuthenticated]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_URL}/journal/`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const getPreview = (content) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-darkGreen">My Journal</h1>
          {isAuthenticated ? (
            <Button 
              text="+ New Entry" 
              class="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
              click={() => navigate('/journal/new')}
            />
          ) : (
            <Button 
              text="Login to Write" 
              class="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
              click={() => document.getElementById('login_modal').showModal()}
            />
          )}
        </div>

        {!isAuthenticated ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">Please login to view your journal entries</p>
            <Button 
              text="Login" 
              class="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
              click={() => document.getElementById('login_modal').showModal()}
            />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No journal entries yet</p>
            <p className="text-gray-400 text-sm">Start writing to track your thoughts and feelings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="bg-white border border-lighterGreen rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/journal/${entry.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-darkGreen">
                    {entry.title || 'Untitled Entry'}
                  </h2>
                  <span className="text-xs text-gray-500">{entry.created_at}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {getPreview(entry.content)}
                </p>
                <div className="mt-4">
                  <span className="text-sm text-darkGreen hover:underline">Read More →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalList;
