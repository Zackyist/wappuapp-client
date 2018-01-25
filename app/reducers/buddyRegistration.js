// TODO: Remove unnecessary references to teams, cities(?), names, profile pics...

'use strict';

import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import {
  CREATE_BUDDY_PROFILE_REQUEST,
  CREATE_BUDDY_PROFILE_SUCCESS,
  CREATE_BUDDY_PROFILE_FAILURE,
  OPEN_BUDDY_REGISTRATION_VIEW,
  CLOSE_BUDDY_REGISTRATION_VIEW,
  UPDATE_NAME,
  UPDATE_PROFILE_PIC,
  DISMISS_INTRODUCTION,
  GET_BUDDY_PROFILE_REQUEST,
  GET_BUDDY_PROFILE_SUCCESS,
  GET_BUDDY_PROFILE_FAILURE,
  SELECT_TEAM,
  RESET
} from '../actions/buddyRegistration';

import {
  NO_SELECTED_CITY_FOUND
} from '../concepts/city';

import { getTeams } from './team';

const initialState = fromJS({
  isRegistrationViewOpen: false,
  bio: '',
  lookingFor: '',
  pushToken: '',
  selectedTeam: 0,
  isLoading: false,
  isError: false,
  isIntroductionDismissed: false
});

export default function registration(state = initialState, action) {
  switch (action.type) {
    case OPEN_BUDDY_REGISTRATION_VIEW:
      return state.set('isBuddyRegistrationViewOpen', true);
    case CLOSE_BUDDY_REGISTRATION_VIEW:
      return state.merge({
        isIntroductionDismissed: false,
        isBuddyRegistrationViewOpen: false
      });
    case DISMISS_INTRODUCTION:
      return state.set('isIntroductionDismissed', true);
    case UPDATE_BIO:
      return state.set('bio_text', action.payload);
    case UPDATE_LOOKING_FOR:
      return state.set('bio_looking_for', action.payload);
    case UPDATE_PUSH_TOKEN:
      return state.set('pushToken', action.payload);
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
    case CREATE_BUDDY_PROFILE_REQUEST:
      return state.merge({
        'isLoading': true,
        'isError': false
      });
    case GET_BUDDY_PROFILE_REQUEST:
      return state.set('isLoading', true);
    case CREATE_BUDDY_PROFILE_SUCCESS:
      return state.merge({
        'isLoading': false,
        'isError': false
      });
    case CREATE_BUDDY_PROFILE_FAILURE:
    case GET_BUDDY_PROFILE_FAILURE:
      return state.merge({
        'isLoading': false,
        'isError': true
      });
    case NO_SELECTED_CITY_FOUND:
      return state.merge({
        'isBuddyRegistrationViewOpen': action.payload
      })
    case GET_BUDDY_PROFILE_SUCCESS:
      return state.merge({
        'userId': action.payload.id,
        'bio_text': action.payload.bio_text,
        'bio_looking_for': action.payload.bio_looking_for,
        'pushToken': action.payload.pushToken,
        'profilePic': action.payload.profilePic,
        'name': action.payload.name,
        'selectedTeam': action.payload.team,
        'uuid': action.payload.uuid,
        'image_url' : action.payload.image_url,
        'isLoading': false
      });
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
