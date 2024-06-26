import React from 'react';
const Error404 = () => {

  return (
    <div className='error404'>
    <div className="text-center">
        <h1 className="mb-4 text-6xl font-semibold text-blue-500">404</h1>
        <p className="mb-4 text-lg text-gray-600">Oops! Il semble que la page n'existe pas.</p>
        <div className="animate-bounce">
        <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>
        </div>
        <p className="mt-4 text-gray-600">Retourner sur la page d'<a href="/hackathon-final-destination/" className="text-blue-500">accueil</a>.</p>
    </div>
    </div>
  );
};

export default Error404;
