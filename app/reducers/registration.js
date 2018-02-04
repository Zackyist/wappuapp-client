'use strict';

import { fromJS, List } from 'immutable';
import { createSelector } from 'reselect';
import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  OPEN_REGISTRATION_VIEW,
  CLOSE_REGISTRATION_VIEW,
  UPDATE_NAME,
  UPDATE_PROFILE_PIC,
  DISMISS_INTRODUCTION,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  SELECT_TEAM,
  RESET,
  ACKNOWLEDGE_DATA_UPDATE,
  CLOSE_BUDDY_INTRO_VIEW,
  CLOSE_BUDDY_REGISTRATION_VIEW,
  GET_LOOKING_FOR_TYPES_FAILURE,
  GET_LOOKING_FOR_TYPES_REQUEST,
  GET_LOOKING_FOR_TYPES_SUCCESS,
  OPEN_BUDDY_INTRO_VIEW,
  OPEN_BUDDY_REGISTRATION_VIEW,
  SET_DATA_UPDATED,
  UPDATE_BUDDY_BIO,
  UPDATE_BUDDY_CLASS_YEAR,
  UPDATE_BUDDY_LOOKING_FOR,
  UPDATE_BUDDY_PUSH_TOKEN
} from '../actions/registration';

import {
  NO_SELECTED_CITY_FOUND
} from '../concepts/city';

import { getTeams } from './team';

const initialState = fromJS({
  isRegistrationViewOpen: false,
  name: '',
  profilePic: null,
  selectedTeam: 0,
  isLoading: false,
  isError: false,
  isIntroductionDismissed: false,
  isBuddyIntroViewOpen: false,
  isBuddyRegistrationViewOpen: false,
  bio_text: '',
  bio_looking_for_type_id: 1,
  class_year: '',
  isDataUpdated: false,
  lookingForTypes: [],
  pushToken: ''
});

export default function registration(state = initialState, action) {
  switch (action.type) {
    case OPEN_REGISTRATION_VIEW:
      return state.set('isRegistrationViewOpen', true);
    case CLOSE_REGISTRATION_VIEW:
      return state.merge({
        isIntroductionDismissed: false,
        isRegistrationViewOpen: false
      });
    case DISMISS_INTRODUCTION:
      return state.set('isIntroductionDismissed', true);
    case UPDATE_NAME:
      return state.set('name', action.payload);
    case UPDATE_PROFILE_PIC:
      return state.set('profilePic', action.payload);
    case SELECT_TEAM:
      return state.set('selectedTeam', action.payload);
    case RESET:
      return state.merge({
        'name': '',
        'selectedTeam': 0
      });
    case CREATE_USER_REQUEST:
      return state.merge({
        'isLoading': true,
        'isError': false
      });
    case GET_LOOKING_FOR_TYPES_REQUEST:
    case GET_USER_REQUEST:
      return state.set('isLoading', true);
    case CREATE_USER_SUCCESS:
      return state.merge({
        'isLoading': false,
        'isError': false
      });
    case GET_LOOKING_FOR_TYPES_FAILURE:
    case CREATE_USER_FAILURE:
    case GET_USER_FAILURE:
      return state.merge({
        'isLoading': false,
        'isError': true
      });
    case NO_SELECTED_CITY_FOUND:
      return state.merge({
        'isRegistrationViewOpen': action.payload
      })
    case GET_USER_SUCCESS:
      return state.merge({
        'userId': action.payload.id,
        'profilePic': action.payload.profilePic,
        'name': action.payload.name,
        'selectedTeam': action.payload.team,
        'uuid': action.payload.uuid,
        'image_url' : action.payload.image_url,
        'isLoading': false
      });
    case ACKNOWLEDGE_DATA_UPDATE:
      return state.set('isDataUpdated', false);
    case CLOSE_BUDDY_INTRO_VIEW:
      return state.set('isBuddyIntroViewOpen', false);
    case CLOSE_BUDDY_REGISTRATION_VIEW:
      return state.set('isBuddyRegistrationViewOpen', false);
    case GET_LOOKING_FOR_TYPES_SUCCESS:
      return state.merge({
        'lookingForTypes': List(action.payload),
        'isLoading': false
      });
    case OPEN_BUDDY_INTRO_VIEW:
      return state.set('isBuddyIntroViewOpen', true);
    case OPEN_BUDDY_REGISTRATION_VIEW:
      return state.set('isBuddyRegistrationViewOpen', true);
    case SET_DATA_UPDATED:
      return state.set('isDataUpdated', true);
    case UPDATE_BUDDY_BIO:
      return state.set('bio_text', action.payload);
    case UPDATE_BUDDY_CLASS_YEAR:
      return state.set('class_year', action.payload);
    case UPDATE_BUDDY_LOOKING_FOR:
      return state.set('bio_looking_for_type_id', action.payload);
    case UPDATE_BUDDY_PUSH_TOKEN:
      return state.set('pushToken', action.payload);
    default:
      return state;
  }
}

// # Selectors
export const getUserId = state => state.registration.get('userId');
export const getUserName = state => state.registration.get('name');
export const getUserTeamId = state => state.registration.get('selectedTeam', 0);
export const getUserTeam = createSelector(getUserTeamId, getTeams,
  (teamId, teams) => teams.find(item => item.get('id') === teamId))
export const getLookingForTypes = state => state.registration.get('lookingForTypes');
export const isDataUpdated = state => state.registration.get('isDataUpdated');
