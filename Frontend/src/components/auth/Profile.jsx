import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import Button from '../Button';
import { API_URL, API_BASE_URL } from '../../config/api';

function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [recentQuickCheckIns, setRecentQuickCheckIns] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch recent check-ins
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRecentData = async () => {
      try {
        setLoadingData(true);
        
        // Fetch regular check-ins
        const checkInResponse = await axios.get(`${API_URL}/checkin/`);
        setRecentCheckIns(checkInResponse.data.slice(0, 2));
        
        // Fetch quick check-ins
        const quickCheckInResponse = await axios.get(`${API_URL}/checkin/quick/`);
        setRecentQuickCheckIns(quickCheckInResponse.data.slice(0, 2));
        
      } catch (error) {
        console.error('Error fetching recent check-ins:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchRecentData();
  }, [isAuthenticated]);

  // Show loading or redirect if not authenticated
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-darkGreen text-xl">Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white border border-lighterGreen rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-darkGreen text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-darkGreen mb-2">
                  Welcome, {user?.username || 'User'}!
                </h1>
                <p className="text-gray-600">
                  Member since {user?.date_joined ? formatDate(user.date_joined) : 'Recently'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button 
              text="Logout" 
              class="px-6 py-2 border  text-red-400 hover:text-white rounded-lg hover:bg-red-400 font-semibold"
              click={handleLogout}
            />
          </div>
        </div>

        {/* Psychartist Status Section - Only show if user is not already an approved psychartist */}
        {!user?.psychartist_profile && (
          <div className="bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200/50 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  {user?.psychartist_status?.has_application ? (
                    <span className="text-2xl">⏳</span>
                  ) : (
                    <span className="text-2xl">🧠</span>
                  )}
                </div>
                <div>
                  {user?.psychartist_status?.has_application ? (
                    <>
                      <h3 className="text-lg font-semibold text-darkGreen mb-1">
                        Psychartist Application Status
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Your application is currently under review
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-darkGreen mb-1">
                        Are you a mental health professional?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Join our network and help people on their wellness journey
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {user?.psychartist_status?.has_application ? (
                <div className="text-right">
                  <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold text-sm mb-2">
                    {user.psychartist_status.status === 'pending' && 'Review Pending'}
                    {user.psychartist_status.status === 'rejected' && 'Application Rejected'}
                  </div>
                  <p className="text-xs text-gray-500">
                    Applied: {new Date(user.psychartist_status.applied_at).toLocaleDateString()}
                  </p>
                  {user.psychartist_status.status === 'rejected' && (
                    <Button 
                      text="Apply Again" 
                      class="px-4 py-1 mt-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm"
                      click={() => document.getElementById('psychartist_modal').showModal()}
                    />
                  )}
                </div>
              ) : (
                <Button 
                  text="Become Psychartist" 
                  class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold whitespace-nowrap"
                  click={() => document.getElementById('psychartist_modal').showModal()}
                />
              )}
            </div>
          </div>
        )}

        {/* Approved Psychartist Profile Card */}
        {user?.psychartist_profile && (
          <div className="bg-linear-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                {user.psychartist_profile.profile_picture ? (
                  <img 
                    src={`${API_BASE_URL}${user.psychartist_profile.profile_picture}`} 
                    alt={user.psychartist_profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-darkGreen text-white flex items-center justify-center text-xl font-semibold">
                    {user.psychartist_profile.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-darkGreen">
                    Dr. {user.psychartist_profile.full_name}
                  </h3>
                  <div className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    <span className="mr-1">✓</span>
                    Verified Professional
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{user.psychartist_profile.specialization}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{user.psychartist_profile.average_rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{user.psychartist_profile.years_of_experience} years experience</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${user.psychartist_profile.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span>{user.psychartist_profile.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
              <Button 
                text="View My Profile" 
                class="px-4 py-2 border border-darkGreen text-darkGreen rounded-lg hover:bg-lighterGreen font-semibold"
                click={() => navigate(`/psychartist/${user.psychartist_profile.id}`)}
              />
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="bg-white border border-lighterGreen rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-darkGreen">Recent Activity</h2>
            <Button 
              text="View All Check-ins" 
              class="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
              click={() => navigate('/checkInHistory')}
            />
          </div>

          {loadingData ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading recent activity...</div>
            </div>
          ) : (
            <>
              {/* Recent Quick Check-ins */}
              {recentQuickCheckIns.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-darkGreen mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    Recent Quick Check-ins
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentQuickCheckIns.map((checkIn, index) => (
                      <div key={index} className="bg-green-50/50 border border-green-200/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl">{checkIn.mood}</span>
                          <span className="text-xs text-gray-500">{checkIn.created_at}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Intensity:</span>
                            <div className="flex gap-1">
                              {[...Array(10)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-2 h-3 rounded-sm ${i < checkIn.intensity ? 'bg-green-500' : 'bg-gray-200'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-darkGreen">{checkIn.intensity}/10</span>
                          </div>
                          {checkIn.note && (
                            <p className="text-sm text-gray-700">{checkIn.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Full Check-ins */}
              {recentCheckIns.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-darkGreen mb-4 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Recent Full Check-ins
                  </h3>
                  <div className="space-y-4">
                    {recentCheckIns.map((checkIn, index) => (
                      <div 
                        key={index} 
                        className="border border-lighterGreen rounded-lg p-4"
                        style={{ backgroundColor: checkIn.color || '#f0f9ff' }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{checkIn.mood?.split(' ')[0]}</span>
                            <div>
                              <h4 className="font-semibold text-darkGreen">
                                {checkIn.mood?.split(' ')[1] || 'Mood Check-in'}
                              </h4>
                              <p className="text-sm text-gray-600">{checkIn.created_at}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Reason: </span>
                            <span className="text-sm text-gray-600">{checkIn.reason}</span>
                          </div>
                          {checkIn.notes && (
                            <div>
                              <span className="text-sm font-semibold text-gray-700">Notes: </span>
                              <span className="text-sm text-gray-600">{checkIn.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Activity Message */}
              {recentCheckIns.length === 0 && recentQuickCheckIns.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-darkGreen mb-2">Start Your Wellness Journey</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't done any check-ins yet. Start tracking your mood and well-being today!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            text="New Check-in" 
            class="w-full py-3 bg-darkGreen text-white rounded-lg hover:bg-neutralGray font-semibold"
            click={() => navigate('/checkIn')}
          />
          <Button 
            text="Quick Check-in" 
            class="w-full py-3 border border-darkGreen text-darkGreen rounded-lg hover:bg-lighterGreen font-semibold"
            click={() => navigate('/quickcheckin')}
          />
          <Button 
            text="Journal Entry" 
            class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            click={() => navigate('/journal/new')}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;