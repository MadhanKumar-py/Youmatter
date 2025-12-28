import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Button';
import { useAuth } from '../auth/AuthContext';
import { API_URL } from '../../config/api';

function JournalView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Show loading or redirect if not authenticated
  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-darkGreen text-xl">Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await axios.get(`${API_URL}/journal/${id}/`);
      setEntry(response.data);
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      alert('Entry not found');
      navigate('/journal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/journal/${id}/`);
      navigate('/journal');
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      alert('Failed to delete entry');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50/30 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-lighterGreen rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-darkGreen mb-2">
                {entry.title || 'Untitled Entry'}
              </h1>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Created: {entry.created_at}</span>
                {entry.updated_at !== entry.created_at && (
                  <span>Updated: {entry.updated_at}</span>
                )}
              </div>
            </div>
            <Button 
              text="← Back" 
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              click={() => navigate('/journal')}
            />
          </div>

          <div className="border-t border-lighterGreen pt-6 mb-6">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </div>

          <div className="flex gap-3 justify-end border-t border-lighterGreen pt-6">
            <Button 
              text="Edit" 
              class="px-4 py-2 border border-darkGreen text-darkGreen rounded-lg hover:bg-lighterGreen"
              click={() => navigate(`/journal/edit/${id}`)}
            />
            <Button 
              text="Delete" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              click={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalView;
