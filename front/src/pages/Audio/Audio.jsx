import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronRightIcon, CheckCircleIcon, ExclamationCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import SentimentIndicator from '../../components/Icon/SentimentIndicator';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { fetchAudio, analyseAudio, setProgress } from '../../utils/audioSlice';

export default function Audio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const audio = useSelector((state) => state.audio.audios[id]);
  const loading = useSelector((state) => state.audio.loading);
  const error = useSelector((state) => state.audio.error);
  const progress = useSelector((state) => state.audio.progress[id]);
  const analyseLoading = useSelector((state) => state.audio.analyseLoading);
  const [isTranscriptionOpen, setIsTranscriptionOpen] = useState(true);
  const [showRawTranscription, setShowRawTranscription] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('processing_update', (data) => {
      if (data.audio_id === parseInt(id)) {
        dispatch(setProgress({ audioId: id, status: data.status }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchAudio(id));
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this audio?')) {
      try {
        await fetch(`http://localhost:5001/audios/${id}`, {
          method: 'DELETE',
        });
        navigate('/hackathon-final-destination/');
      } catch (error) {
        dispatch(setError(error));
      }
    }
  };

  const handleAnalyse = () => {
    dispatch(analyseAudio(id));
  };

  const getProgressBar = (label, score) => {
    switch (label) {
      case 'NEUTRE':
        return <div className="absolute top-0 left-0 h-full bg-orange-500 rounded text-xs" style={{ width: `50%` }}>{score}%</div>
      case 'POSITIF':
        return <div className="absolute top-0 left-0 h-full bg-green-500 rounded" style={{ width: `70%` }}>{score}%</div>
      case 'TRES_POSITIF':
        return <div className="absolute top-0 left-0 h-full bg-green-700 rounded" style={{ width: `90%` }}>{score}%</div>
      case 'NEGATIF':
        return <div className="absolute top-0 left-0 h-full bg-red-500 rounded" style={{ width: `30%` }}>{score}%</div>
      case 'TRES_NEGATIF':
        return <div className="absolute top-0 left-0 h-full bg-red-700 rounded text-xs" style={{ width: `10%` }}>{score}%</div>
      default:
        return <div className="absolute top-0 left-0 h-full rounded" style={{ width: `0%` }}></div>
    }
  };

  const dismissAlert = () => {
    const alertElement = document.getElementById(id);
    if (alertElement) {
      alertElement.remove();
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

  if (!audio) {
    return <p className="text-center text-gray-500">Audio not found</p>;
  }

  const sentimentScore = audio.sentiment && audio.sentiment.score !== null && audio.sentiment.score < 1
    ? (audio.sentiment.score * 100).toFixed(2)
    : audio.sentiment?.score;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg mt-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <Link to="/hackathon-final-destination/" className="return">
          <ArrowLeftIcon className='w-5 h-5 items-center'></ArrowLeftIcon>
        </Link>
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
        {progress && (
          <div id={id} className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
          <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="font-medium ml-2">Progression: </span> 
          <div className="ml-1 font-medium">
            {progress}
          </div>
          <button
            type="button"
            onClick={dismissAlert}
            className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        )}
        
        <div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Transcription:</span>
            <button onClick={() => setIsTranscriptionOpen(!isTranscriptionOpen)}>
              {isTranscriptionOpen ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
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
                          {getProgressBar(audio.sentiment.label, sentimentScore)}
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
            <span className='font-semibold'>Voir la transcription compléte</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 transition-transform ${
                showRawTranscription ? 'transform -rotate-90' : ''
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
          <button 
          onClick={handleDelete} 
          disabled={analyseLoading} 
          className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 ${analyseLoading ? 'cursor-not-allowed opacity-50 animate-pulse' : ''}`}>
            Supprimer
            </button>
        </div>
      </div>
    </div>
  );
}
