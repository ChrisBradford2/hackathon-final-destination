import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import SentimentIndicator from '../../components/Icon/SentimentIndicator';

export default function Audio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyseLoading, setAnalyseLoading] = useState(false);
  const [isTranscriptionOpen, setIsTranscriptionOpen] = useState(true);
  const [showRawTranscription, setShowRawTranscription] = useState(false);

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

  const getProgressBar = (label) => {
    switch (label) {
      case 'NEUTRE':
        return <div className="absolute top-0 left-0 h-full bg-orange-500 rounded" style={{ width: `50%` }}></div>
      case 'POSITIF':
        return <div className="absolute top-0 left-0 h-full bg-green-500 rounded" style={{ width: `70%` }}></div>
      case 'TRES_POSITIF':
        return <div className="absolute top-0 left-0 h-full bg-green-700 rounded" style={{ width: `90%` }}></div>
      case 'NEGATIF':
        return <div className="absolute top-0 left-0 h-full bg-red-500 rounded" style={{ width: `30%` }}></div>
      case 'TRES_NEGATIF':
        return <div className="absolute top-0 left-0 h-full bg-red-700 rounded" style={{ width: `10%` }}></div>
      default:
        return <div className="absolute top-0 left-0 h-full rounded" style={{ width: `0%` }}></div>
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

  console.log(audio);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg mt-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Audio Details</h1>
        <div className={`flex items-center ${audio.isAnalysed ? 'text-green-500' : 'text-red-500'}`}>
          {audio.isAnalysed ? <CheckCircleIcon className="w-5 h-5 mr-1" /> : <ExclamationCircleIcon className="w-5 h-5 mr-1" />}
          <span>{audio.isAnalysed ? 'Analysé' : 'Pas analysé'}</span>
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
        <div className="flex space-x-8 justify-between">
        <div>
          <span className="font-semibold">Besoin d'aide: </span>
          <span className={audio.isInNeed ? 'text-green-500' : (audio.isInNeed === false ? 'text-red-500' : 'text-gray-500')}>
            {audio.isInNeed ? 'Oui' : (audio.isInNeed === false ? 'Non' : 'Aucune analyse effectuée')}
          </span>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between space-x-3">
              <span className="font-semibold">Sentiment:</span> 
              {audio.sentiment ? (
                  <>
                    <div className="flex items-center space-x-1">
                      <p className="flex items-center">
                        <SentimentIndicator sentiment={audio.sentiment.label} />
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p><span className="font-medium mr-2">Score:</span></p>
                      <div className="relative w-40 h-4 bg-gray-200 rounded">
                        {getProgressBar(audio.sentiment.label)}
                        {/* <div className="absolute top-0 left-0 h-full bg-green-500 rounded" style={{ width: `${audio.sentiment.score}%` }}></div> */}
                      </div>
                    </div>
                  </>
                
              ) : 'Aucune analyse effectuée'}
          </div>
        </div>
        </div>
        <button
            className="flex items-center space-x-1 focus:outline-none"
            onClick={() => setShowRawTranscription(!showRawTranscription)}
          >
            <span>Voir la transcription compléte</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 transition-transform ${
                showRawTranscription ? 'transform rotate-180' : ''
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {showRawTranscription && (
            <div className="mt-2">
              <textarea
              readOnly
              className="w-full mt-2 p-2 border rounded"
              rows={5}
              value={audio.raw_transcription ? audio.raw_transcription : 'Aucune transcription'}
            />
            </div>
          )}
        <div className="flex space-x-4">
          <button
            onClick={handleAnalyse}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${analyseLoading ? 'cursor-not-allowed opacity-50 animate-pulse' : ''}`}
            disabled={analyseLoading}>
            {analyseLoading ? 'Analysing...' : audio.isAnalysed ? 'Re-analyse' : 'Analyse'}
          </button>
          <button onClick={handleDelete} disabled={analyseLoading} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Supprimer</button>
        </div>
      </div>
    </div>
  );
}
