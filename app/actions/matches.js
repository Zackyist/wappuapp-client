'use strict';

import _ from 'lodash';
import api from '../services/api';
import {createRequestActionTypes} from '.';

const SET_MATCHES = 'SET_MATCHES';
const {
  FETCH_MATCHES_STARTED,
  FETCH_MATCHES_SUCCESS,
  FETCH_MATCHES_FAILURE
} = createRequestActionTypes('FETCH_MATCHES');

const SET_BUDDY = 'SET_BUDDY';
const SET_BUDDY_FETCH_SUCCESS = 'SET_BUDDY_FETCH_SUCCESS';
const {
  FETCH_BUDDY_INFO_STARTED,
  FETCH_BUDDY_INFO_FAILURE
} = createRequestActionTypes('FETCH_BUDDY_INFO');

export const fetchMatches = (uuid) => {
  return (dispatch) => {
    dispatch({ type: FETCH_MATCHES_STARTED });

    api.getMatches(uuid)
      .then(matches => {
        matches = _.isArray(matches) ? matches : [matches];

        dispatch({
          type: SET_MATCHES,
          payload: matches
        });
        dispatch({ type: FETCH_MATCHES_SUCCESS });
      })
      .catch(error => dispatch({ type: FETCH_MATCHES_FAILURE, payload: error }))
  }
};

export const fetchBuddyInfo = (userId) => {
  return (dispatch) => {
    dispatch({ type: FETCH_BUDDY_INFO_STARTED });

    api.getUserProfile(userId)
      .then(user => {
        user = _.isObject(user) ? user : {user};

        dispatch({
          type: SET_BUDDY,
          payload: user
        });
      })
      .catch(error => dispatch({ type: FETCH_BUDDY_INFO_FAILURE, payload: error }))
  }
};

export const setBuddiesFetched = () => {
  return (dispatch) => {
    dispatch({ type: SET_BUDDY_FETCH_SUCCESS });
  }
}

export {
  SET_MATCHES,
  FETCH_MATCHES_STARTED,
  FETCH_MATCHES_SUCCESS,
  FETCH_MATCHES_FAILURE,
  SET_BUDDY,
  FETCH_BUDDY_INFO_STARTED,
  SET_BUDDY_FETCH_SUCCESS,
  FETCH_BUDDY_INFO_FAILURE,
};