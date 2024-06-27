import React, { useState, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
//import './Transcription.css';

const Transcription = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState(null);
  

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleStop = async (blobUrl) => {
    const audioBlob = await fetch(blobUrl).then((r) => r.blob());
    const uniqueSuffix = Date.now();
    const audioFile = new File([audioBlob], `recording_${uniqueSuffix}.wav`, { type: 'audio/wav' });

    setAudioFile(audioFile);
  };

  const handleUpload = () => {
    if (!audioFile) {
      alert('Veuillez sélectionner un fichier audio');
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioFile);

    fetch('http://localhost:5001/upload_audio', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTranscription(data.transcription);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="transcription-container m-36">
      <h1>Transcription Audio</h1>
      
      <div className="upload-section flex items-center w-full max-w-md mb-3 seva-fields formkit-fields">
        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" aria-describedby="file_input_help" id="file_input" type="file" accept="audio/*" onChange={handleFileChange}/>

        {/* <input type="file" accept="audio/*" onChange={handleFileChange} /> */}
        <button type='button' className='px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300' onClick={handleUpload}>Transcrire</button>
      </div>

      <div className="transcription-section">
        <h2>Transcription :</h2>
        <textarea value={transcription} readOnly id="transcript" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"/>
      </div>

      <div className="record-section">
        <h2>Enregistrer un Audio :</h2>
        <ReactMediaRecorder
          audio
          onStop={mediaBlobUrl=>handleStop(mediaBlobUrl)}
          render={({ startRecording, stopRecording, mediaBlobUrl }) => (
            <div>
              <button type='button' className='px-3 py-2 text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100' onClick={startRecording}>Commencer l'enregistrement</button>
              <button type='button' className='px-3 py-2 text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100' onClick={stopRecording}>Arrêter l'enregistrement</button>
              <div className="my-4">
      {mediaBlobUrl && (
        <audio controls className="w-full">
          <source src={mediaBlobUrl} type="audio/mpeg" />
          Votre navigateur ne supporte pas les éléments audio.
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

export default Transcription;