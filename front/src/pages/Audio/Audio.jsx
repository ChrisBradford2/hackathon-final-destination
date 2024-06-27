import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Audio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyseLoading, setAnalyseLoading] = useState(false);
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

  useEffect(() => {
    fetchAudio();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (audio.sentiment && audio.sentiment.score !== null) {
    audio.sentiment.score = (audio.sentiment.score * 10).toFixed(2);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Audio Details</h1>
      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold">Audio ID:</span> {audio.id}
        </div>
        <div>
          <span className="font-semibold">Created at:</span> {new Date(audio.createdAt).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Audio:</span> 
          <audio controls className="mt-2">
            <source src={audio.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
        <div>
          <span className="font-semibold">Analysed:</span> {audio.isAnalysed ? 'Yes' : 'No'}
        </div>
        <div>
          <button
            className="flex items-center space-x-1 focus:outline-none"
            onClick={() => setShowRawTranscription(!showRawTranscription)}
          >
            <span>Show Transcription</span>
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
              <span className="font-semibold">Raw Transcription:</span>{' '}
              {audio.raw_transcription ? audio.raw_transcription : 'None'}
            </div>
          )}
        </div>
        <div>
          <span className="font-semibold">Transcription:</span> {audio.transcription ? audio.transcription : 'None'}
        </div>
        <div>
          <span className="font-semibold">In need:</span> {audio.isInNeed ? 'Yes' : 'No'}
        </div>
        <div>
          <span className="font-semibold">Sentiment:</span> {audio.sentiment ? (
            <div className="ml-4">
              <p><span className="font-semibold">Label:</span> {audio.sentiment.label}</p>
              <p><span className="font-semibold">Score:</span> {audio.sentiment.score} %</p>
            </div>
          ) : 'None'}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAnalyse}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${analyseLoading ? 'cursor-not-allowed opacity-50 animate-pulse' : ''}`}
            disabled={analyseLoading}>
            {analyseLoading ? 'Analysing...' : audio.isAnalysed ? 'Re-analyse' : 'Analyse'}
          </button>
          {!analyseLoading && (
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}
