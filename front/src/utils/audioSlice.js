import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    audios: {},
    loading: false,
    error: null,
    progress: {},
    analyseLoading: false,  // State for the loading of the analysis
  },
  reducers: {
    setAudio(state, action) {
      state.audios[action.payload.id] = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setProgress(state, action) {
      const { audioId, status } = action.payload;
      state.progress[audioId] = status;
    },
    setAnalyseLoading(state, action) {  // Reducer for the loading of the analysis
      state.analyseLoading = action.payload;
    },
  },
});

export const { setAudio, setLoading, setError, setProgress, setAnalyseLoading } = audioSlice.actions;

export const fetchAudio = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`http://localhost:5001/audios/${id}`);
    const data = await response.json();
    dispatch(setAudio(data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error));
    dispatch(setLoading(false));
  }
};

export const analyseAudio = (id) => async (dispatch) => {
  dispatch(setAnalyseLoading(true));
  try {
    await fetch(`http://localhost:5001/process_audio/${id}`, {
      method: 'POST',
    });
    dispatch(fetchAudio(id));
    dispatch(setAnalyseLoading(false));
    toast.success(`L'analyse de l'audio ${id} s'est terminée avec succès.`);
  } catch (error) {
    dispatch(setError(error));
    dispatch(setAnalyseLoading(false));
    toast.error('Error during analysis.');
  }
};

export default audioSlice.reducer;
