import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import {
  PLAYING,
  STREAMING,
  STOPPED,
} from '../constants/RadioStates';


// # Action creators
const SET_RADIO_SONG = 'radio/SET_RADIO_SONG';
export const setRadioSong = (song) => ({ type: SET_RADIO_SONG, payload: song });

const SET_RADIO_STATUS = 'radio/SET_RADIO_STATUS';
export const setRadioStatus = (status) => ({ type: SET_RADIO_STATUS, payload: status });

const SET_RADIO_STATIONS = 'radio/SET_RADIO_STATIONS';
export const setRadioStations = (stations) => ({ type: SET_RADIO_STATIONS, payload: stations });

const SET_RADIO_STATION_ACTIVE = 'radio/SET_RADIO_STATION_ACTIVE';
export const setRadioStationActive = (station) => ({ type: SET_RADIO_STATION_ACTIVE, payload: station });

const TOGGLE_RADIO_BAR = 'radio/TOGGLE_RADIO_BAR';
export const toggleRadioBar = (expanded) => ({ type: TOGGLE_RADIO_BAR, payload: expanded });

export const closeRadio = () => (dispatch) => {
  dispatch(setRadioStatus(STOPPED))
  dispatch(setRadioSong(''))
}


// # Selectors
export const getRadioStatus = state => state.radio.get('status');
export const getRadioSong = state => state.radio.get('song');
export const getRadioMode = state => state.radio.get('expanded');
export const getRadioName = state => state.radio.get('name');
export const getRadioUrl = state => state.radio.get('url');
export const getActiveStationId = state => state.radio.get('activeStationId');
export const getRadioStations = state => state.radio.get('stations');

export const isRadioPlaying = createSelector(
  getRadioStatus,
  (status) => status === PLAYING || status === STREAMING
);

export const getActiveRadioStation = createSelector(
  getActiveStationId, getRadioStations,
  (activeId, stations) => stations.find(item => item.get('radioId') === activeId)
);


const placeholderRadioStations = [
  {
    radioId: 1,
    cityId: 3,
    cityName: 'Tampere'
  },
  {
    radioId: 2,
    cityId: 2,
    cityName: 'Helsinki'
  },
];

// # Reducer
const initialState = fromJS({
  url: 'http://stream.basso.fi:8000/stream',
  // url: 'http://stream.wappuradio.fi:80/wappuradio.mp3',
  name: 'Bassoradio',
  status: STOPPED,
  expanded: false,
  song: '',
  stations: placeholderRadioStations,
  activeStationId: placeholderRadioStations[0].radioId,
});

export default function radio(state = initialState, action) {
  switch (action.type) {
    case SET_RADIO_SONG: {
      return state.set('song', action.payload);
    }

    case SET_RADIO_STATUS: {
      return state.set('status', action.payload);
    }

    case SET_RADIO_STATIONS: {
      return state.set('stations', fromJS(action.payload));
    }

    case SET_RADIO_STATION_ACTIVE: {
      return state.set('activeStationId', action.payload);
    }

    case TOGGLE_RADIO_BAR: {
      return state.set('expanded', action.payload);
    }

    default: {
      return state;
    }
  }
}
