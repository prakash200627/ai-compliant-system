import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/api';
import StatCard from '../components/StatCard';
import ComplaintTable from '../components/ComplaintTable';
import Badge from '../components/Badge';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintService.getMyComplaints();
        setComplaints(response.data);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Failed to fetch dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Stats derivation
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) =>
    ['open', 'in progress', 'in_progress', 'escalated'].includes(c.status?.toLowerCase())
  ).length;
  const resolvedCount = complaints.filter((c) => c.status?.toLowerCase() === 'resolved').length;

  const columns = [
    {
      header: 'Title',
      key: 'title',
      render: (row) => <span className="font-medium text-gray-900">{row.title}</span>,
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
          })}
        </span>
      ),
    },
  ];

  // Get up to 5 of the most recent complaints
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
          <span className="text-gray-500 font-medium text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title + Action Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-sm text-gray-500">Monitor and track your complaint tickets in real-time.</p>
        </div>
        <div>
          <Link
            to="/complaints/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
          >
            Submit New Complaint
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Total Complaints Submitted" value={totalCount} />
        <StatCard label="Pending Complaints" value={pendingCount} />
        <StatCard label="Resolved Complaints" value={resolvedCount} />
      </div>

      {/* Recent Complaints Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
          {complaints.length > 5 && (
            <Link to="/complaints" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          )}
        </div>
        <ComplaintTable
          columns={columns}
          data={recentComplaints}
          emptyStateMessage="No complaints yet. Submit your first one to get started."
        />
      </div>
    </div>
  );
};

export default Dashboard;
