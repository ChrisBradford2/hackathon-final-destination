import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function Audio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyseLoading, setAnalyseLoading] = useState(false);
  const [isTranscriptionOpen, setIsTranscriptionOpen] = useState(true);

  const fetchAudio = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/audios/${id}`);
      const data = await response.json();
      setAudio(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this audio?')) {
      try {
        await fetch(`http://localhost:5001/audios/${id}`, {
          method: 'DELETE',
        });
        navigate('/hackathon-final-destination/');
      } catch (error) {
        setError(error);
      }
    }
  };

  const handleAnalyse = async () => {
    setAnalyseLoading(true);
    try {
      await fetch(`http://localhost:5001/process_audio/${id}`, {
        method: 'POST',
      });
      await fetchAudio();
      setAnalyseLoading(false);
    } catch (error) {
      setError(error);
      setAnalyseLoading(false);
    }
  };

  useEffect(() => {
    fetchAudio();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (audio.sentiment && audio.sentiment.score !== null && audio.sentiment.score < 1) {
    audio.sentiment.score = (audio.sentiment.score * 100).toFixed(2);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Audio Details</h1>
        <div className={`flex items-center ${audio.isAnalysed ? 'text-green-500' : 'text-red-500'}`}>
          {audio.isAnalysed ? <CheckCircleIcon className="w-5 h-5 mr-1" /> : <ExclamationCircleIcon className="w-5 h-5 mr-1" />}
          <span>{audio.isAnalysed ? 'Analysed' : 'Not Analysed'}</span>
        </div>
      </div>
      <div className="space-y-4 text-gray-700">
      <div className="flex justify-between items-center mb-6 bg-gray-50 px-8 rounded">
        <div>
          <span className="font-semibold">Audio ID:</span> {audio.id}
        </div>
        <div>
          <span className="font-semibold">Créé le:</span> {new Date(audio.createdAt).toLocaleString()}
        </div>
        </div>
        <div>
          <span className="font-semibold">Audio:</span> 
          <audio controls className="mt-2 w-full">
            <source src={audio.url} type="audio/mpeg" />
            Votre navigateur ne supporte pas les éléments audio.
          </audio>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Transcription:</span>
            <button onClick={() => setIsTranscriptionOpen(!isTranscriptionOpen)}>
              {isTranscriptionOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </button>
          </div>
          {isTranscriptionOpen && (
            <textarea
              readOnly
              className="w-full mt-2 p-2 border rounded"
              rows={5}
              value={audio.transcription ? audio.transcription : 'Aucune description'}
            />
          )}
        </div>
        <div className="flex space-x-8">
        <div>
          <span className="font-semibold">Besoin d'aide: </span>
          <span className={audio.isInNeed ? 'text-green-500' : 'text-red-500'}>
            {audio.isInNeed ? 'Oui' : 'Non'}
          </span>
        </div>
        <div className="flex items-center">
            <span className="font-semibold mr-2">Sentiment:</span> 
            {audio.sentiment ? (
              <div className="ml-4">
                <div className="flex items-center">
                  <p>
                    <span className="font-semibold">Label:</span> 
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> {audio.sentiment.label}
                  </p>
                </div>
                <div className="mt-2">
                  <p><span className="font-semibold">Score:</span></p>
                  <div className="relative w-full h-4 bg-gray-200 rounded">
                    <div className="absolute top-0 left-0 h-full bg-green-500 rounded" style={{ width: `${audio.sentiment.score}%` }}></div>
                  </div>
                </div>
              </div>
            ) : 'Aucun sentiment détecté'}
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAnalyse}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${analyseLoading ? 'cursor-not-allowed opacity-50 animate-pulse' : ''}`}
            disabled={analyseLoading}>
            {analyseLoading ? 'Analysing...' : audio.isAnalysed ? 'Re-analyse' : 'Analyse'}
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Supprimer</button>
        </div>
      </div>
    </div>
  );
}
