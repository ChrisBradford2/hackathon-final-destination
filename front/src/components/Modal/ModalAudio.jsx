import Transcription from "../../pages/Transcriptions/Transcription";

const ModalAudio = ({ showModal, setShowModal, content }) => {
    if (!showModal) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-md">
          {content}
          <Transcription/>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setShowModal(false)}
          >
            Fermer
          </button>
        </div>
      </div>
    );
  };

  export default ModalAudio;