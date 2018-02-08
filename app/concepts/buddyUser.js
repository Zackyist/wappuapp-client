// TODO: Is getBuddyPushToken still needed?

import { fromJS, Map } from 'immutable';

import api from '../services/api';
import {createRequestActionTypes} from '../actions';
import { fetchUserProfile } from '../concepts/user';

// # Selectors
export const getBuddyPushToken = state => state.buddyUser.getIn(['buddyProfile', 'pushToken'], '') || '';
export const getBuddyUserProfile = state => state.buddyUser.get('buddyProfile') || {};

// # Action creators
const {
  GET_BUDDY_PROFILE_REQUEST,
  GET_BUDDY_PROFILE_SUCCESS,
  GET_BUDDY_PROFILE_FAILURE
} = createRequestActionTypes('GET_BUDDY_PROFILE');
const SET_BUDDY_PROFILE = 'SET_BUDDY_PROFILE';

export const fetchBuddyProfile = (userId) => (dispatch) => {
  dispatch({ type: GET_BUDDY_PROFILE_REQUEST });
  return api.getBuddyProfile(userId)
    .then( buddyProfile => {
      dispatch({
        type: SET_BUDDY_PROFILE,
        payload: buddyProfile
      });
      dispatch({ type: GET_BUDDY_PROFILE_SUCCESS });
    })
    .catch(error => dispatch({ type: GET_BUDDY_PROFILE_FAILURE, error: true, payload: error }));
}

export const updateCurrentBuddy = (buddy) => (dispatch) => {
      dispatch({
        type: SET_BUDDY_PROFILE,
        payload: buddy
      });
      dispatch(fetchUserProfile(buddy.id));
};

// # Reducer
const initialState = fromJS({
  buddyProfile: {},
  isLoading: false
});

export default function city(state = initialState, action) {
  switch (action.type) {
    case SET_BUDDY_PROFILE: {
      return state.set('buddyProfile', action.payload);
    }

    case GET_BUDDY_PROFILE_REQUEST: {
      return state.merge({
        buddyProfile: Map(),
        isLoading: true
      });
    }

    case GET_BUDDY_PROFILE_SUCCESS:
    case GET_BUDDY_PROFILE_FAILURE: {
      return state.set('isLoading', false);
    }

    default: {
      return state;
    }
  }
}