import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Button';
import { API_URL } from '../../config/api';

function JournalEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await axios.get(`${API_URL}/journal/${id}/`);
      setTitle(response.data.title || '');
      setContent(response.data.content);
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      alert('Entry not found');
      navigate('/journal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Content cannot be empty');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}/journal/${id}/`, {
        title: title.trim() || null,
        content: content.trim()
      });
      navigate(`/journal/${id}`);
    } catch (error) {
      console.error('Error updating journal entry:', error);
      alert('Failed to update entry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50/30 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-lighterGreen rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-darkGreen">Edit Entry</h1>
            <Button 
              text="← Back" 
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              click={() => navigate(`/journal/${id}`)}
            />
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-semibold border-b-2 border-lighterGreen focus:border-darkGreen focus:outline-none pb-2 bg-transparent"
                maxLength={200}
              />
            </div>

            <div>
              <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 border border-lighterGreen rounded-lg p-4 focus:outline-darkGreen/60 resize-none leading-relaxed"
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                text="Cancel" 
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                click={() => navigate(`/journal/${id}`)}
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JournalEdit;
