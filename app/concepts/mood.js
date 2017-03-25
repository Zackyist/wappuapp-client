import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import moment from 'moment';
import { times } from 'lodash';


// # Action creators
export const TOGGLE_MOOD_SLIDER = 'mood/TOGGLE_MOOD_SLIDER';
export const SET_MOOD_DATA = 'mood/SET_MOOD_DATA';

export const setMoodData = (mood) => ({ type: SET_MOOD_DATA, payload: mood });


// # Selectors
export const getMoodData = state => state.mood.get('data');
export const getLimitLine = state => state.mood.get('limitLine');


const processMoodData = data => data;

export const getMoodDataForChart = createSelector(
  getMoodData,
  (data) => processMoodData(data)
);

export const getLimitLineData = createSelector(
  getLimitLine, getMoodDataForChart,
  (limit, data) => data.map(item => ({
    date: item.get('date'),
    value: limit
  }))
);

export const getKpiValues = state => fromJS({
  Own: 33.6,
  Team: 44.1,
  Total: 58.5,
});


// # Reducer
const placeHolderMoodData = times(27).map((item, index) => ({
  date: moment('2017-05-02').subtract(index, 'd').format('YYYY-MM-DD'),
  avg: index > 8 ? (70 - index * 2) + Math.floor(Math.random() * 5) : null
})).reverse();


const initialState = fromJS({
  data: placeHolderMoodData,
  limitLine: 50,
  showMoodSlider: false
});

export default function mood(state = initialState, action) {
  switch (action.type) {
    case SET_MOOD_DATA: {
      return state.set('data', action.payload);
    }

    case TOGGLE_MOOD_SLIDER: {
      return state.set('showMoodSlider', action.payload);
    }

    default: {
      return state;
    }
  }
}
