import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';


const getSentimentIcon = (label) => {
  switch (label) {
    case 'NEUTRE':
      return { icon: '😐', color: 'text-orange-500', text_sentiment: 'NEUTRE'};
    case 'POSITIF':
      return { icon: <CheckCircleIcon className="w-5 h-5 text-green-500 mr-1" />, color: 'text-green-500', text_sentiment: 'POSITIF'};
    case 'TRES_POSITIF':
      return { icon: <CheckCircleIcon className="w-5 h-5 text-green-700 mr-1" />, color: 'text-green-700', text_sentiment: 'TRÈS POSITIF'};
    case 'NEGATIF':
      return { icon: <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-1" />, color: 'text-red-500', text_sentiment: 'NÉGATIF' };
    case 'TRES_NEGATIF':
      return { icon: <ExclamationCircleIcon className="w-5 h-5 text-red-700 mr-1" />, color: 'text-red-700', text_sentiment: 'TRÈS NÉGATIF' };
    default:
      return { icon: '', color: 'text-gray-500', text_sentiment: ''};
  }
};
const SentimentIndicator = ({ sentiment }) => {
    const { icon, color, text_sentiment } = getSentimentIcon(sentiment);
  
    return (
      <div className="flex items-center space-x-2">
        <p className={`flex items-center ${color}`}>
          {icon} {text_sentiment}
        </p>
      </div>
    );
  };
  
  export default SentimentIndicator;
  