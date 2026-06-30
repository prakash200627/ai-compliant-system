import React from 'react';

const Badge = ({ type, value }) => {
  if (!value) return null;

  const normalizedValue = value.toLowerCase().replace(/_/g, ' ').trim();
  let label = value;
  let classes = 'bg-gray-100 text-gray-700';

  if (type === 'priority') {
    switch (normalizedValue) {
      case 'high':
        classes = 'bg-red-100 text-red-700';
        label = 'High';
        break;
      case 'medium':
        classes = 'bg-yellow-100 text-yellow-700';
        label = 'Medium';
        break;
      case 'low':
        classes = 'bg-green-100 text-green-700';
        label = 'Low';
        break;
      default:
        label = value.charAt(0).toUpperCase() + value.slice(1);
        break;
    }
  } else if (type === 'status') {
    switch (normalizedValue) {
      case 'open':
        classes = 'bg-blue-100 text-blue-700';
        label = 'Open';
        break;
      case 'in progress':
      case 'in_progress':
        classes = 'bg-yellow-100 text-yellow-700';
        label = 'In Progress';
        break;
      case 'resolved':
        classes = 'bg-green-100 text-green-700';
        label = 'Resolved';
        break;
      case 'escalated':
        classes = 'bg-red-100 text-red-700';
        label = 'Escalated';
        break;
      default:
        label = normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
        break;
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
};

export default Badge;
