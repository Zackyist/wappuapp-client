'user strict';

import {
  FETCH_MATCHES_REQUEST,
  FETCH_MATCHES_SUCCESS,
  FETCH_MATCHES_FAILURE,
  FETCH_BUDDY_REQUEST,
  FETCH_BUDDY_SUCCESS,
  FETCH_BUDDY_FAILURE,
  UPDATE_DATASOURCE_REQUEST,
  UPDATE_DATASOURCE_SUCCESS,
  UPDATE_DATASOURCE_FAILURE,
  SET_LIST_READY,
  RESET_MATCHES
} from '../actions/matches';

const initialState = {
 matchesFetched: false,
 buddiesFetched: false,
 datasourceReady: false,
 listReady: false,
 errorMsg: '',
 buddyList: [],
 matchList: [],
 datasource: [],
 isLoading: true
};

const matches = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MATCHES_REQUEST: {
      return {...state, matchesFetched: false, isLoading: true, listReady: false}
    }
    case FETCH_MATCHES_FAILURE: {
      return {...state, isLoading: false, errorMsg: action.payload}
    }
    case FETCH_MATCHES_SUCCESS: {
      return {...state, matchesFetched: true,  matchList: action.payload}
    }
    case FETCH_BUDDY_REQUEST: {
      return {...state, buddiesFetched: false}
    }
    case FETCH_BUDDY_FAILURE: {
      return {...state, isLoading: false, errorMsg: action.payload}
    }
    case FETCH_BUDDY_SUCCESS: {
      return {...state, buddiesFetched: true, buddyList: [...state.buddyList, action.payload]}
    }
    case UPDATE_DATASOURCE_REQUEST: {
      return {...state, datasourceReady: false}
    }
    case UPDATE_DATASOURCE_FAILURE: {
      return {...state, isLoading: false, error: action.payload}
    }
    case UPDATE_DATASOURCE_SUCCESS: {
      return {...state, datasourceReady: true, isLoading: false, datasource: action.payload }
    }
    case SET_LIST_READY: {
      return {...state, listReady: true}
    }
    case RESET_MATCHES: {
      return {...initialState}
    }
    default:
      return state;
  }
};

export default matches;
