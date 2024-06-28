import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';


const getSentimentIcon = (label) => {
  switch (label) {
    case 'NEUTRE':
      return { icon: '😐', color: 'text-orange-500' };
    case 'POSITIF':
      return { icon: <CheckCircleIcon className="w-5 h-5 text-green-500 mr-1" />, color: 'text-green-500' };
    case 'TRES_POSITIF':
      return { icon: <CheckCircleIcon className="w-5 h-5 text-green-700 mr-1" />, color: 'text-green-700' };
    case 'NEGATIF':
      return { icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-1" />, color: 'text-red-500' };
    case 'TRES_NEGATIF':
      return { icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-700 mr-1" />, color: 'text-red-700' };
    default:
      return { icon: '', color: 'text-gray-500' };
  }
};
const SentimentIndicator = ({ sentiment }) => {
    const { icon, color } = getSentimentIcon(sentiment);
  
    return (
      <div className="flex items-center space-x-2">
        <p className={`flex items-center ${color}`}>
          {icon} {sentiment}
        </p>
      </div>
    );
  };
  
  export default SentimentIndicator;
  