import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Button';
import { useAuth } from '../auth/AuthContext';
import { API_URL } from '../../config/api';

function JournalCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      document.getElementById('login_modal').showModal();
      return;
    }
    
    if (!content.trim()) {
      alert('Please write something before saving');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post(`${API_URL}/journal/`, {
        title: title.trim() || null,
        content: content.trim()
      });
      console.log('Journal entry saved:', response.data);
      navigate('/journal');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-lighterGreen rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-darkGreen">New Journal Entry</h1>
            <Button 
              text="← Back" 
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              click={() => navigate('/journal')}
            />
          </div>

          <form onSubmit={handleSave} className="space-y-6">
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
                placeholder="What's on your mind today?"
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
                click={() => navigate('/journal')}
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JournalCreate;
