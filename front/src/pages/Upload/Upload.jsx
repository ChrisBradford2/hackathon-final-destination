import React, { useState, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';

const Upload = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  useEffect(() => {
    if (audioFile) {
      const formData = new FormData();
      formData.append('file', audioFile);
    }
  }, [audioFile]);

  const handleStop = async (blobUrl) => {
    const audioBlob = await fetch(blobUrl).then((r) => r.blob());
    const uniqueSuffix = Date.now();
    const audioFile = new File([audioBlob], `recording_${uniqueSuffix}.wav`, { type: 'audio/wav' });

    setAudioFile(audioFile);
  };

  const handleUpload = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!audioFile) {
      alert('Veuillez sélectionner un fichier audio');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const response = await fetch('http://localhost:5001/upload_audio', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      console.log(responseText);

      // Check if the response is JSON
      try {
        const data = JSON.parse(responseText);
        setSuccess('Upload réussi');
        console.log(data);
      } catch (e) {
        // If it's not JSON, treat it as a plain text response
        if (response.ok) {
          setSuccess(responseText);
        } else {
          throw new Error(responseText);
        }
      }
    } catch (error) {
      console.error(error);
      setError('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transcription-container">
      <h1>Upload audio</h1>
      
      <form action="">
        <div className="upload-section flex items-center w-full max-w-md mb-3 seva-fields formkit-fields">
          <input 
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
            aria-describedby="file_input_help" 
            id="file_input" 
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange}
          />
        </div>
        {!loading ? (
          <button 
            type='button' 
            className='px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300' 
            onClick={handleUpload}
          >
            Envoyer
          </button>
        ) : (
          <button 
            type='button' 
            className='px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 animation-pulse' 
            disabled
          >
            Envoi en cours...
          </button>
        )}
      </form>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <div className="record-section mt-6">
        <h2>Enregistrer un Audio :</h2>
        <ReactMediaRecorder
          audio
          onStop={mediaBlobUrl=>handleStop(mediaBlobUrl)}
          render={({ startRecording, stopRecording, mediaBlobUrl }) => (
            <div>
              <button 
                type='button' 
                className='px-3 py-2 text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100' 
                onClick={startRecording}
              >
                Commencer l'enregistrement
              </button>
              <button 
                type='button' 
                className='px-3 py-2 text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100' 
                onClick={stopRecording}
              >
                Arrêter l'enregistrement
              </button>
              <div className="my-4">
                {mediaBlobUrl && (
                  <audio controls className="w-full">
                    <source src={mediaBlobUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Upload;
