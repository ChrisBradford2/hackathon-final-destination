import React, { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import './Transcription.css';

const Transcription = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Logique pour télécharger le fichier audio
    console.log('Uploading file:', audioFile);
    // Exemple: Envoi de la transcription simulée
    setTranscription('Ceci est une transcription simulée pour le fichier audio téléchargé.');
  };

  return (
    <div className="transcription-container">
      <h1>Transcription Audio</h1>
      
      <div className="upload-section">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Transcrire l'audio</button>
      </div>

      <div className="transcription-section">
        <h2>Transcription :</h2>
        <textarea value={transcription} readOnly />
      </div>

      <div className="record-section">
        <h2>Enregistrer un Audio :</h2>
        <ReactMediaRecorder
          audio
          render={({ startRecording, stopRecording, mediaBlobUrl }) => (
            <div>
              <button onClick={startRecording}>Commencer l'enregistrement</button>
              <button onClick={stopRecording}>Arrêter l'enregistrement</button>
              {mediaBlobUrl && <audio src={mediaBlobUrl} controls />}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Transcription;
