import React from 'react';

const StatCard = ({ label, value }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900 tracking-tight">
        {value !== undefined && value !== null ? value : 0}
      </dd>
    </div>
  );
};

export default StatCard;
