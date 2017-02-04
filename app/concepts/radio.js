import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import {
  PLAYING,
  STREAMING,
  STOPPED,
} from '../constants/RadioStates';


// # Action creators
export const SET_RADIO_SONG = 'radio/SET_RADIO_SONG';
export const setRadioSong = (song) => ({ type: SET_RADIO_SONG, payload: song });

export const SET_RADIO_STATUS = 'radio/SET_RADIO_STATUS';
export const setRadioStatus = (status) => ({ type: SET_RADIO_STATUS, payload: status });

export const TOGGLE_RADIO_BAR = 'radio/TOGGLE_RADIO_BAR';
export const toggleRadioBar = (expanded) => ({ type: TOGGLE_RADIO_BAR, payload: expanded });


export const closeRadio = () => (dispatch) => {
  dispatch(setRadioStatus(STOPPED))
  dispatch(setRadioSong(''))
}


// # Selectors
export const getRadioStatus = state => state.radio.get('status');
export const getRadioSong = state => state.radio.get('song');
export const getRadioMode = state => state.radio.get('expanded');

export const isRadioPlaying = createSelector(
  getRadioStatus,
  (status) => status === PLAYING || status === STREAMING
);


// # Reducer
const initialState = fromJS({
  status: STOPPED,
  expanded: false,
  song: ''
});

export default function radio(state = initialState, action) {
  switch (action.type) {
    case SET_RADIO_SONG: {
      return state.set('song', action.payload);
    }

    case SET_RADIO_STATUS: {
      return state.set('status', action.payload);
    }

    case TOGGLE_RADIO_BAR: {
      return state.set('expanded', action.payload);
    }

    default: {
      return state;
    }
  }
}
