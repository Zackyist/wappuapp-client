import { createSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { parseInt } from 'lodash';

import api from '../services/api';
import {createRequestActionTypes} from '../actions';
import {
  UPDATE_BUDDY_BIO,
  UPDATE_BUDDY_CLASS_YEAR,
  UPDATE_BUDDY_LOOKING_FOR
} from '../actions/registration';

// # Selectors
export const getBuddyBio = state => state.buddyUser.getIn(['buddyProfile', 'bio_text'], '') || '';
export const getBuddyClassYear = state => state.buddyUser.getIn(['buddyProfile', 'class_year'], '') || '';
export const getBuddyLookingFor = state => state.buddyUser.getIn(['buddyProfile', 'bio_looking_for_type_id'], '') || '';
export const getBuddyPushToken = state => state.buddyUser.getIn(['buddyProfile', 'push_token'], '') || '';

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

// # Reducer
const initialState = fromJS({
  buddyProfile: {},
  isLoading: false
});

export default function city(state = initialState, action) {
  switch (action.type) {
    case SET_BUDDY_PROFILE: {
      return state.set('buddyProfile', fromJS(action.payload));
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
