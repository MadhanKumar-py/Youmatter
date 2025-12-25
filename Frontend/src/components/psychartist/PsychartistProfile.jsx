import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Button';
import { useAuth } from '../auth/AuthContext';
import { API_URL } from '../../config/api';

function PsychartistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [psychartist, setPsychartist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPsychartist();
  }, [id, isAuthenticated]);

  const fetchPsychartist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/psychartist/${id}/`);
      setPsychartist(response.data);
    } catch (error) {
      console.error('Error fetching psychartist:', error);
      setError('Failed to load psychartist profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400 text-xl">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400 text-xl">☆</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300 text-xl">☆</span>);
    }
    
    return stars;
  };

  // Show loading or redirect if not authenticated
  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-darkGreen text-xl">Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50/30 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="text-darkGreen text-xl">Loading psychartist profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !psychartist) {
    return (
      <div className="min-h-screen bg-green-50/30 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-500 text-xl mb-4">{error || 'Psychartist not found'}</div>
            <Button 
              text="Back to Psychartists" 
              class="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
              click={() => navigate('/psychartists')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            text="← Back to Psychartists" 
            class="px-4 py-2 border border-darkGreen text-darkGreen rounded-lg hover:bg-lighterGreen"
            click={() => navigate('/psychartists')}
          />
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-lighterGreen p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="w-32 h-32 bg-darkGreen text-white rounded-full flex items-center justify-center text-4xl font-bold">
                {psychartist.profile_picture ? (
                  <img 
                    src={psychartist.profile_picture} 
                    alt={psychartist.full_name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  psychartist.full_name.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-darkGreen">
                  Dr. {psychartist.full_name}
                </h1>
                <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <span className="mr-1">✓</span>
                  Verified Professional
                </div>
              </div>
              
              <p className="text-xl text-gray-600 mb-4">{psychartist.specialization}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex mr-3">
                  {renderStars(psychartist.average_rating)}
                </div>
                <span className="text-gray-600">
                  {psychartist.average_rating > 0 
                    ? `${psychartist.average_rating.toFixed(1)} (${psychartist.total_reviews} reviews)`
                    : 'New psychartist'
                  }
                </span>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-semibold text-darkGreen">{psychartist.years_of_experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">License Number</p>
                  <p className="font-semibold text-darkGreen">{psychartist.license_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approach</p>
                  <p className="font-semibold text-darkGreen">{psychartist.approach}</p>
                </div>
                {psychartist.session_rate && (
                  <div>
                    <p className="text-sm text-gray-500">Session Rate</p>
                    <p className="font-semibold text-darkGreen">${psychartist.session_rate}/hour</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-lighterGreen p-6">
              <h2 className="text-xl font-semibold text-darkGreen mb-4">About Dr. {psychartist.full_name}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{psychartist.bio}</p>
            </div>

            {/* Education & Certifications */}
            <div className="bg-white rounded-xl shadow-sm border border-lighterGreen p-6">
              <h2 className="text-xl font-semibold text-darkGreen mb-4">Education & Qualifications</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Education</h3>
                  <p className="text-gray-700 whitespace-pre-line">{psychartist.education}</p>
                </div>
                {psychartist.certifications && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Certifications</h3>
                    <p className="text-gray-700 whitespace-pre-line">{psychartist.certifications}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-lighterGreen p-6">
              <h3 className="text-lg font-semibold text-darkGreen mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-darkGreen">{psychartist.contact_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-darkGreen">{psychartist.phone_number}</p>
                </div>
                {psychartist.languages && (
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p className="text-darkGreen">{psychartist.languages}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            {psychartist.available_hours && (
              <div className="bg-white rounded-xl shadow-sm border border-lighterGreen p-6">
                <h3 className="text-lg font-semibold text-darkGreen mb-4">Availability</h3>
                <p className="text-gray-700">{psychartist.available_hours}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PsychartistProfile;