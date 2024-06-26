import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Audio () {
  // Get the id from the URL
  const { id } = useParams();
  
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get audio from API
  const fetchAudio = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/audios/${id}`);
      const data = await response.json();
      console.log(data);
      setAudio(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.error(error);
    }
  };

  // Fetch audio on component mount
  useEffect(() => {
    fetchAudio();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Audio</h1>
      <p>Audio ID: {audio.id}</p>
      <p>Created at: {audio.createdAt}</p>
      <p>Audio: {audio.audio}</p>
      <p>Analysed: {audio.isAnalysed ? 'Yes' : 'No'}</p>
      <p>Transcription: {audio.transcription ? audio.transcription : 'None'}</p>
      <p>In need: {audio.isInNeed ? 'Yes' : 'No'}</p>
      <p>URL: {audio.url}</p>
      <p>Sentiment: {audio.sentiment ? audio.sentiment : 'None'}</p>
    </div>
  );
}