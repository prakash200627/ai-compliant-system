import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { complaintService } from '../services/api';

const NewComplaint = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!title.trim()) {
      tempErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      tempErrors.description = 'Description is required';
    } else if (description.trim().length < 20) {
      tempErrors.description = 'Description must be at least 20 characters';
    }
    if (!category) {
      tempErrors.category = 'Category is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await complaintService.createComplaint(title, description, category);
      setSuccessMsg('Complaint submitted successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      console.error('Error creating complaint:', err);
      const errMsg = err.response?.data?.error || 'Failed to submit complaint. Please verify your connection.';
      setApiError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-2">Submit New Complaint</h1>
        <p className="text-sm text-gray-500">
          Submit your issue and our automated AI system will categorize and prioritize it.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1">
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                placeholder="Brief summary of the issue (e.g., Double billed for June subscription)"
              />
            </div>
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors({ ...errors, category: '' });
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
              >
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="service">Service</option>
                <option value="general">General</option>
              </select>
            </div>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Minimum 20 characters)
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={6}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                placeholder="Please describe the issue with as much detail as possible, including steps to reproduce or relevant context..."
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {description.length} characters (minimum 20 characters required).
            </p>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {successMsg && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3">
              <p className="text-sm font-medium text-green-800">{successMsg}</p>
            </div>
          )}

          {apiError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm font-medium text-red-800">{apiError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;
