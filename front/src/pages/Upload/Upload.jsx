import React, { useState, useRef } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
    setFileName(file ? file.name : '');
  };

  const handleStop = async (blobUrl) => {
    const audioBlob = await fetch(blobUrl).then((r) => r.blob());
    const uniqueSuffix = Date.now();
    const audioFile = new File([audioBlob], `recording_${uniqueSuffix}.wav`, { type: 'audio/wav' });

    setAudioFile(audioFile);
    setFileName(`recording_${uniqueSuffix}.wav`);
    setIsRecording(false);
  };

  const handleUpload = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!audioFile) {
      toast.error('Veuillez sélectionner un fichier audio');
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

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          toast.success(responseText);
        } catch (e) {
          setSuccess(`${fileName} a bien été enregistré`);
          toast.success(`${fileName} a bien été enregistré`);
        }
      } else {
        throw new Error(responseText);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <ToastContainer />

      <div className="transcription-container">
        <h1>Upload audio</h1>

        <form action="">
  <div className="upload-section flex items-center w-full max-w-md mb-3 seva-fields formkit-fields">
    <label htmlFor="file_input" className="flex items-center w-full max-w-md">
      <span className="text-gray-700 text-sm font-medium mr-2">Importer un audio</span>
      <input
        className="sr-only"
        id="file_input"
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
      />
      <div className="relative border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-500 flex items-center justify-center py-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        <span className="text-sm font-medium text-gray-900">
          {fileName ? fileName : 'Sélectionner un fichier audio'}
        </span>
      </div>
    </label>
  </div>
</form>


        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

        <div className="record-section flex items-center mt-6">
          <h2 className="mr-4">Enregistrer un Audio :</h2>
          <ReactMediaRecorder
            audio
            onStop={(blobUrl) => handleStop(blobUrl)}
            render={({ startRecording, stopRecording }) => (
              <div className="flex items-center">
                <button
                  type="button"
                  className={`px-3 py-2 text-sm font-medium text-center focus:outline-none rounded-full border border-gray-200
                    ${isRecording ? 'bg-red-500 text-white' : 'bg-green-500 text-gray-900 hover:bg-green-600 hover:text-white'}
                  `}
                  onClick={() => {
                    if (!isRecording) {
                      startRecording();
                      setIsRecording(true);
                    } else {
                      stopRecording();
                      setIsRecording(false);
                    }
                  }}
                >
                  {isRecording ? "Arrêter l'enregistrement" : "Commencer l'enregistrement"}
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {!loading ? (
          <button
            type="button"
            className="px-6 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            onClick={handleUpload}
          >
            Envoyer
          </button>
        ) : (
          <button
            type="button"
            className="px-6 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 animation-pulse"
            disabled
          >
            Envoi en cours...
          </button>
        )}
      </div>
    </div>
  );
};

export default Upload;
