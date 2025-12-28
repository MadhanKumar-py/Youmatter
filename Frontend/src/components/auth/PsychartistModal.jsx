import { useState } from 'react';
import axios from 'axios';
import Button from '../Button';
import { API_URL } from '../../config/api';

function PsychartistModal() {
  const [formData, setFormData] = useState({
    full_name: '',
    license_number: '',
    specialization: '',
    years_of_experience: '',
    education: '',
    certifications: '',
    bio: '',
    contact_email: '',
    phone_number: '',
    available_hours: '',
    session_rate: '',
    languages: '',
    approach: ''
  });
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add profile picture if selected
      if (profilePicture) {
        submitData.append('profile_picture', profilePicture);
      }

      const response = await axios.post(`${API_URL}/psychartist/apply/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Close modal and show success message
      document.getElementById('psychartist_modal').close();
      alert('Your psychartist application has been submitted successfully! We will review it and get back to you within 2-3 business days.');
      
      // Reset form
      setFormData({
        full_name: '',
        license_number: '',
        specialization: '',
        years_of_experience: '',
        education: '',
        certifications: '',
        bio: '',
        contact_email: '',
        phone_number: '',
        available_hours: '',
        session_rate: '',
        languages: '',
        approach: ''
      });
      setProfilePicture(null);
      
    } catch (error) {
      console.error('Error submitting psychartist application:', error);
      
      if (error.response?.data) {
        // Handle validation errors from backend
        if (typeof error.response.data === 'object') {
          setErrors(error.response.data);
        } else {
          setErrors({ general: error.response.data.error || 'Failed to submit application. Please try again.' });
        }
      } else {
        setErrors({ general: 'Failed to submit application. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
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
    'PTSD Treatment',
    'Other'
  ];

  const approaches = [
    'Cognitive Behavioral Therapy (CBT)',
    'Psychodynamic Therapy',
    'Humanistic Therapy',
    'Mindfulness-Based Therapy',
    'Solution-Focused Therapy',
    'Acceptance and Commitment Therapy (ACT)',
    'Dialectical Behavior Therapy (DBT)',
    'Eye Movement Desensitization and Reprocessing (EMDR)',
    'Integrative Approach',
    'Other'
  ];

  return (
    <dialog id="psychartist_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white border border-lighterGreen max-w-4xl max-h-[90vh] overflow-y-auto">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 className="font-bold text-2xl text-darkGreen mb-6 text-center">
          Become a Psychartist
        </h3>
        
        <p className="text-gray-600 text-center mb-6">
          Join our network of mental health professionals and help people on their wellness journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="alert alert-error text-sm">
              <span>{errors.general}</span>
            </div>
          )}

          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-darkGreen mb-4">Personal Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  placeholder="Dr. John Smith"
                  required
                />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name[0]}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  License Number *
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  placeholder="PSY12345"
                  required
                />
                {errors.license_number && <p className="text-red-500 text-xs mt-1">{errors.license_number[0]}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  placeholder="dr.smith@example.com"
                  required
                />
                {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email[0]}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  placeholder="+1 (555) 123-4567"
                  required
                />
                {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number[0]}</p>}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Upload a professional photo (optional)</p>
              {errors.profile_picture && <p className="text-red-500 text-xs mt-1">{errors.profile_picture[0]}</p>}
            </div>
          </div>

          {/* Professional Information */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-darkGreen mb-4">Professional Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Specialization *
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization[0]}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  placeholder="5"
                  min="0"
                  required
                />
                {errors.years_of_experience && <p className="text-red-500 text-xs mt-1">{errors.years_of_experience[0]}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Therapeutic Approach *
                </label>
                <select
                  name="approach"
                  value={formData.approach}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  required
                >
                  <option value="">Select Approach</option>
                  {approaches.map((approach) => (
                    <option key={approach} value={approach}>{approach}</option>
                  ))}
                </select>
                {errors.approach && <p className="text-red-500 text-xs mt-1">{errors.approach[0]}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Languages Spoken
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  placeholder="English, Spanish, French"
                />
                {errors.languages && <p className="text-red-500 text-xs mt-1">{errors.languages[0]}</p>}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Education *
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm h-20 resize-none"
                placeholder="Ph.D. in Clinical Psychology, University of California, 2015"
                required
              />
              {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education[0]}</p>}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Certifications
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm h-20 resize-none"
                placeholder="Licensed Clinical Psychologist, Certified CBT Therapist"
              />
              {errors.certifications && <p className="text-red-500 text-xs mt-1">{errors.certifications[0]}</p>}
            </div>
          </div>

          {/* Practice Information */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-semibold text-darkGreen mb-4">Practice Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Available Hours
                </label>
                <input
                  type="text"
                  name="available_hours"
                  value={formData.available_hours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  placeholder="Mon-Fri 9AM-5PM"
                />
                {errors.available_hours && <p className="text-red-500 text-xs mt-1">{errors.available_hours[0]}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Session Rate (per hour)
                </label>
                <input
                  type="number"
                  name="session_rate"
                  value={formData.session_rate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm"
                  placeholder="150"
                  min="0"
                />
                {errors.session_rate && <p className="text-red-500 text-xs mt-1">{errors.session_rate[0]}</p>}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Professional Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-lighterGreen rounded-lg focus:outline-darkGreen/60 text-sm h-32 resize-none"
              placeholder="Tell us about your experience, approach to therapy, and what makes you passionate about helping others..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">This will be displayed on your profile</p>
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio[0]}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              text="Cancel" 
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              click={() => document.getElementById('psychartist_modal').close()}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray disabled:opacity-50 font-semibold"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default PsychartistModal;