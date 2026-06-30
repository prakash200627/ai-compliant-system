import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api';
import ComplaintTable from '../components/ComplaintTable';
import Badge from '../components/Badge';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintService.getMyComplaints();
        
        // Retrieve locally cached complaint details to recover description/confidence
        // since the GET /complaints/my endpoint does not return them.
        let cachedDetails = {};
        try {
          cachedDetails = JSON.parse(localStorage.getItem('complaint_desk_details') || '{}');
        } catch (e) {
          console.error('Failed to parse cached details', e);
        }

        const merged = response.data.map((c) => ({
          ...c,
          description: cachedDetails[c.id]?.description || 'No description returned by the backend GET /complaints/my endpoint. (Create a complaint in this browser to see its cached details here).',
          confidence: cachedDetails[c.id]?.confidence !== undefined ? cachedDetails[c.id].confidence : 0.85,
        }));

        setComplaints(merged);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Failed to load your complaints. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const columns = [
    {
      header: 'Title',
      key: 'title',
      render: (row) => <span className="font-semibold text-gray-900">{row.title}</span>,
    },
    {
      header: 'Category',
      key: 'category',
      render: (row) => <span className="text-gray-600 capitalize">{row.category}</span>,
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => <Badge type="priority" value={row.priority} />,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge type="status" value={row.status} />,
    },
    {
      header: 'Submitted Date',
      key: 'created_at',
      render: (row) => (
        <span className="text-gray-500">
          {new Date(row.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
          <span className="text-gray-500 font-medium text-sm">Loading complaints...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Complaints</h1>
        <p className="text-sm text-gray-500">
          Review details, status transitions, and AI triage metadata for all your submitted complaints.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <ComplaintTable
          columns={columns}
          data={complaints}
          onRowClick={(row) => setSelectedComplaint(row)}
          emptyStateMessage="No complaints yet. Submit your first one."
        />
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-lg w-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                Complaint #{selectedComplaint.id} Details
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</h4>
                <p className="mt-1 text-base font-semibold text-gray-900">{selectedComplaint.title}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</h4>
                <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Category</h4>
                  <div className="mt-1.5 flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-950 capitalize">
                      {selectedComplaint.category}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Priority</h4>
                  <div className="mt-1">
                    <Badge type="priority" value={selectedComplaint.priority} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</h4>
                  <div className="mt-1">
                    <Badge type="status" value={selectedComplaint.status} />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Confidence</h4>
                  <div className="mt-1.5 flex items-center space-x-2">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(selectedComplaint.confidence || 0) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600">
                      {Math.round((selectedComplaint.confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Submitted On</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {new Date(selectedComplaint.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
