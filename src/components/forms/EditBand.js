import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiWithFallback from '../../utils/apiWithFallback';

const EditBand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [band, setBand] = useState(null);
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Band name is required')
      .min(2, 'Band name must be at least 2 characters')
      .max(100, 'Band name must be less than 100 characters'),
    genre: Yup.string()
      .required('Genre is required'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters'),
    formed_year: Yup.number()
      .required('Formation year is required')
      .integer('Year must be a whole number')
      .min(1900, 'Year must be after 1900')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
  });

  useEffect(() => {
    fetchBand();
  }, [id]);

  const fetchBand = async () => {
    try {
      const data = await apiWithFallback.getBand(id);
      setBand(data);
    } catch (error) {
      console.error('Error fetching band:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await fetch(`https://music-band-jekc.onrender.com/api/bands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          genre: values.genre,
          description: values.description,
          formed_year: parseInt(values.formed_year)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update band');
      }
      
      setStatus({ success: `Band "${values.name}" updated successfully!` });
      
      setTimeout(() => {
        navigate(`/bands/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Update band error:', error);
      setStatus({ error: error.message || 'Failed to update band' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-white">Loading...</div>;
  if (!band) return <div className="text-center py-16 text-white">Band not found</div>;

  return (
    <div className="animate-fade-in">
      <Link to={`/bands/${id}`} className="inline-flex items-center space-x-2 text-white hover:text-blue-600 transition-colors mb-8">
        <span>←</span>
        <span>Back to Band Details</span>
      </Link>
      
      <div className="text-center py-12 mb-8">
        <h1 className="text-5xl font-black text-white mb-4">
          <span className="text-6xl">✏️</span> Edit Band
        </h1>
        <p className="text-xl text-white max-w-2xl mx-auto">
          Update {band.name}'s information
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card p-8">
          <Formik
            initialValues={{
              name: band.name || '',
              genre: band.genre || '',
              description: band.description || '',
              formed_year: band.formed_year || ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, status }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Band Name *
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter band name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 mb-2">
                    Genre *
                  </label>
                  <Field as="select" id="genre" name="genre" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <option value="">Select a genre</option>
                    <option value="Rock">🎸 Rock</option>
                    <option value="Jazz">🎷 Jazz</option>
                    <option value="Electronic">🎧 Electronic</option>
                    <option value="Pop">🎵 Pop</option>
                    <option value="Hip Hop">🎤 Hip Hop</option>
                    <option value="Classical">🎼 Classical</option>
                    <option value="Country">🤠 Country</option>
                    <option value="Indie">🎤 Indie</option>
                  </Field>
                  <ErrorMessage name="genre" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="formed_year" className="block text-sm font-semibold text-gray-700 mb-2">
                    Formation Year *
                  </label>
                  <Field
                    type="number"
                    id="formed_year"
                    name="formed_year"
                    placeholder="e.g., 2020"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <ErrorMessage name="formed_year" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Tell us about this band..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {status?.error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                    {status.error}
                  </div>
                )}

                {status?.success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl font-semibold">
                    {status.success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Updating Band...</span>
                    </div>
                  ) : (
                    'Update Band'
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditBand;