import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Button';
import { useAuth } from '../auth/AuthContext';
import { API_URL } from '../../config/api';

function PsychartistList() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [psychartists, setPsychartists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPsychartists();
  }, [isAuthenticated]);

  const fetchPsychartists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/psychartist/`);
      setPsychartists(response.data);
    } catch (error) {
      console.error('Error fetching psychartists:', error);
      setError('Failed to load psychartists. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'All Specializations',
    'Clinical Psychology',
    'Counseling Psychology',
    'Cognitive Behavioral Therapy (CBT)',
    'Dialectical Behavior Therapy (DBT)',
    'Family Therapy',
    'Couples Therapy',
    'Child Psychology',
    'Trauma Therapy',
    'Addiction Counseling',
    'Anxiety Disorders',
    'Depression Treatment',
    'PTSD Treatment'
  ];

  const filteredPsychartists = selectedSpecialization && selectedSpecialization !== 'All Specializations'
    ? psychartists.filter(p => p.specialization === selectedSpecialization)
    : psychartists;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="text-darkGreen text-xl">Loading psychartists...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50/30 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <Button 
              text="Try Again" 
              class="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
              click={fetchPsychartists}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-darkGreen mb-4">
            Find Your Psychartist
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Connect with qualified mental health professionals who are here to support your wellness journey
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg border border-lighterGreen p-4 shadow-sm">
            <label className="block text-sm font-semibold text-darkGreen mb-2">
              Filter by Specialization
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 min-w-[250px]"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing {filteredPsychartists.length} of {psychartists.length} psychartists
          </p>
        </div>

        {/* Psychartists Grid */}
        {filteredPsychartists.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-darkGreen mb-2">
              {selectedSpecialization && selectedSpecialization !== 'All Specializations' 
                ? `No psychartists found for ${selectedSpecialization}`
                : 'No psychartists available yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedSpecialization && selectedSpecialization !== 'All Specializations'
                ? 'Try selecting a different specialization or check back later.'
                : 'Our network of mental health professionals is growing. Check back soon!'
              }
            </p>
            {selectedSpecialization && selectedSpecialization !== 'All Specializations' && (
              <Button 
                text="Show All Psychartists" 
                class="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
                click={() => setSelectedSpecialization('All Specializations')}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPsychartists.map((psychartist) => (
              <div 
                key={psychartist.id} 
                className="bg-white border border-lighterGreen rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer p-6 group"
                onClick={() => navigate(`/psychartist/${psychartist.id}`)}
              >
                {/* Profile Picture */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-darkGreen text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    {psychartist.profile_picture ? (
                      <img 
                        src={psychartist.profile_picture} 
                        alt={psychartist.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      psychartist.full_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-darkGreen group-hover:text-neutralGray transition-colors">
                      Dr. {psychartist.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">{psychartist.specialization}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderStars(psychartist.average_rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {psychartist.average_rating > 0 
                      ? `${psychartist.average_rating.toFixed(1)} (${psychartist.total_reviews} reviews)`
                      : 'New psychartist'
                    }
                  </span>
                </div>

                {/* Experience */}
                <div className="mb-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Experience:</span> {psychartist.years_of_experience} years
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Approach:</span> {psychartist.approach}
                  </p>
                </div>

                {/* Languages */}
                {psychartist.languages && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Languages:</span> {psychartist.languages}
                    </p>
                  </div>
                )}

                {/* Session Rate */}
                {psychartist.session_rate && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Session Rate:</span> ${psychartist.session_rate}/hour
                    </p>
                  </div>
                )}

                {/* Bio Preview */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {psychartist.bio.length > 120 
                      ? `${psychartist.bio.substring(0, 120)}...`
                      : psychartist.bio
                    }
                  </p>
                </div>

                {/* Available Hours */}
                {psychartist.available_hours && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold">Available:</span> {psychartist.available_hours}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    text="View Profile" 
                    class="flex-1 py-2 border border-darkGreen text-darkGreen rounded-lg hover:bg-lighterGreen text-sm group-hover:bg-lighterGreen transition-colors"
                    click={(e) => {
                      e.stopPropagation();
                      navigate(`/psychartist/${psychartist.id}`);
                    }}
                  />
                  <Button 
                    text="Contact" 
                    class="flex-1 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray text-sm group-hover:bg-neutralGray transition-colors"
                    click={(e) => {
                      e.stopPropagation();
                      navigate(`/psychartist/${psychartist.id}`);
                    }}
                  />
                </div>

                {/* Verification Badge */}
                <div className="mt-3 flex items-center justify-center">
                  <div className="flex items-center text-xs text-green-600">
                    <span className="mr-1">✓</span>
                    Verified Professional
                  </div>
                </div>

                {/* Click indicator */}
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                    Click to view full profile
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action for Professionals */}
        <div className="mt-16 bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200/50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-semibold text-darkGreen mb-4">
            Are you a mental health professional?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our network of qualified psychartists and help people on their wellness journey. 
            Connect with clients who need your expertise and make a meaningful impact.
          </p>
          <Button 
            text="Join Our Network" 
            class="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            click={() => document.getElementById('psychartist_modal').showModal()}
          />
        </div>
      </div>
    </div>
  );
}

export default PsychartistList;