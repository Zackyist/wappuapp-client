import { createSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import moment from 'moment';
import { isNil } from 'lodash';

import api from '../services/api';
import { getCityId } from './city';
import { createRequestActionTypes } from '../actions/';
import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from '../actions/competition';
import * as NotificationMessages from '../utils/notificationMessage';
import ActionTypes from '../constants/ActionTypes';

// # Selectors
export const getMoodData = state => state.mood.get('data', List()) || List();
export const getLimitLine = state => state.mood.get('limitLine');

const showAfter = '2017-03-21';
const showAfterISO = moment(showAfter).toISOString();
const getValidMoodData = createSelector(
  getMoodData, (data) => {
    if (!data || data.isEmpty()) {
      return List();
    }
    return data.filter(datum => datum.get('date') >= showAfterISO)
  }
);


// Values come in range of [0, 10]
// Presentation of data is in percentage scale [0, 100]
const formatValue = value => {
  return !isNil(value) ? parseInt(value * 10) : null
}
const processMoodData = (data, type) => (data || [])
.map(datum => ({
  date: moment(datum.get('date')).format('YYYY-MM-DD'),
  value: moment(datum.get('date')).format('YYYY-MM-DD') === '2017-03-28' ? 60 :
    moment(datum.get('date')).format('YYYY-MM-DD') === '2017-03-30' ? 70 :
    moment(datum.get('date')).format('YYYY-MM-DD') === '2017-03-31' ? 65 :
    moment(datum.get('date')).format('YYYY-MM-DD') === '2017-04-01' ? 55 : formatValue(datum.get(type))

}));

export const getMoodDataForChart = (type = 'ratingPersonal') => createSelector(
  getValidMoodData,
  (data) => fromJS(processMoodData(data, type)) || List()
);

export const getOwnMoodData = getMoodDataForChart('ratingPersonal');
export const getTeamMoodData = getMoodDataForChart('ratingTeam');
export const getCityMoodData = getMoodDataForChart('ratingCity');

export const getLimitLineData = createSelector(
  getLimitLine, getValidMoodData,
  (limit, data) => data.map(item => ({
    date: moment(item.get('date')).format('YYYY-MM-DD'),
    value: limit
  }))
);


export const getKpiValues = createSelector(
  getValidMoodData,
  (data) => {
    const today = moment();
    const todayData = data.find(datum => moment(datum.get('date')).isSame(today, 'day')) || Map();

    return fromJS({
      ratingPersonal: formatValue(todayData.get('ratingPersonal')),
      ratingTeam: formatValue(todayData.get('ratingTeam')),
      ratingCity: formatValue(todayData.get('ratingCity')),
    });
  });

// # Action creators
export const TOGGLE_MOOD_SLIDER = 'mood/TOGGLE_MOOD_SLIDER';
export const SET_MOOD_DATA = 'mood/SET_MOOD_DATA';

export const setMoodData = (mood) => ({ type: SET_MOOD_DATA, payload: mood });

const {
  GET_MOOD_DATA_REQUEST,
  GET_MOOD_DATA_SUCCESS,
  GET_MOOD_DATA_FAILURE
} = createRequestActionTypes('GET_MOOD_DATA');
export const fetchMoodData = () => (dispatch, getState) => {
  // const state = getState();
  // const cityId = getCityId(state);

  // if (!cityId) {
  //   return;
  // }

  dispatch({ type: GET_MOOD_DATA_REQUEST });

  return api.fetchModels('mood')
  .then(data => {
    dispatch({
      type: SET_MOOD_DATA,
      payload: data
    });
    dispatch({ type: GET_MOOD_DATA_SUCCESS });
  })
  .catch(error => dispatch({ type: GET_MOOD_DATA_FAILURE, error: true, payload: error }));
};


const {
  PUT_MOOD_REQUEST,
  PUT_MOOD_SUCCESS,
  PUT_MOOD_FAILURE
} = createRequestActionTypes('PUT_MOOD');



export const submitMood = (payload) => (dispatch, getState) => {
  dispatch({ type: PUT_MOOD_REQUEST });

  return api.putMood(payload)
  .then(response => {


    dispatch({ type: PUT_MOOD_SUCCESS, payload: response });
    dispatch(fetchMoodData());

    setTimeout(() => {
      dispatch({ type: SHOW_NOTIFICATION,
        payload: NotificationMessages.getMessage({ type: ActionTypes.MOOD }) });
    }, 1000);

    setTimeout(() => {
      dispatch({ type: HIDE_NOTIFICATION });
    }, 5000);

  })
  .catch(e => {
    dispatch({ type: PUT_MOOD_FAILURE, error: e });
  });
};


// # Reducer
// const placeHolderMoodData = times(27).map((item, index) => ({
//   date: moment('2017-05-02').subtract(index, 'd').format('YYYY-MM-DD'),
//   avg: index > 8 ? (70 - index * 2) + Math.floor(Math.random() * 5) : null
// })).reverse();

const initialState = fromJS({
  data: [],
  limitLine: 50,
  showMoodSlider: false
});

export default function mood(state = initialState, action) {
  switch (action.type) {
    case SET_MOOD_DATA: {
      return state.set('data', fromJS(action.payload));
    }

    case TOGGLE_MOOD_SLIDER: {
      return state.set('showMoodSlider', action.payload);
    }

    default: {
      return state;
    }
  }
}
