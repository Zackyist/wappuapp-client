'user strict';

import {
  SET_MATCHES,
  FETCH_MATCHES,
  FETCH_MATCHES_SUCCESS,
  FETCH_MATCHES_ERROR,
  FETCH_BUDDY_INFO,
  SET_BUDDY_FETCH_SUCCESS,
  FETCH_BUDDY_INFO_ERROR,
  SET_BUDDIES,
} from '../actions/matches';

const initialState = {
  dataSource: [],
  matches: [],
  buddies: [],
  matchList: [],
  isLoading: false,
  matchesFetched: false,
  buddiesFetched: false,
  matchListGenerated: false,
  error: null,
  isError: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MATCHES: {
      return {...state, isLoading: true}
    }
    case FETCH_MATCHES_ERROR: {
      return {...state, error: action.payload, isLoading: false, isError: true}
    }
    case SET_MATCHES: {
      return {...state, matches: action.payload}
    }
    case FETCH_MATCHES_SUCCESS: {
      return {...state, matchesFetched: true}
    }
    case FETCH_BUDDY_INFO: {
      return {...state, isLoading: true }
    }
    case FETCH_BUDDY_INFO_ERROR: {
      return {...state, error: action.payload, isLoading: false, isError: true}
    }
    case SET_BUDDIES: {
      return {...state, buddies: action.payload}
    }
    case SET_BUDDY_FETCH_SUCCESS: {
      return {...state, buddiesFetched: true}
    }
    default:
      return state;
  }
};