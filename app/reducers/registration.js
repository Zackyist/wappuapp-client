'use strict';

import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_PROFILE_PIC_REQUEST,
  UPDATE_PROFILE_PIC_SUCCESS,
  UPDATE_PROFILE_PIC_FAILURE,
  OPEN_REGISTRATION_VIEW,
  CLOSE_REGISTRATION_VIEW,
  UPDATE_NAME,
  UPDATE_PROFILE_PIC,
  DISMISS_INTRODUCTION,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  SELECT_TEAM,
  RESET
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
  isIntroductionDismissed: false
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
    case UPDATE_PROFILE_PIC_REQUEST:
      return state.merge({
        'isLoading': true,
        'isError': false
      });
    case UPDATE_PROFILE_PIC_SUCCESS:
      return state.merge({
        'isLoading': false,
        'isError': false
      });
    case UPDATE_PROFILE_PIC_FAILURE:
      return state.merge({
        'isLoading': false,
        'isError': true
      });
    case CREATE_USER_REQUEST:
      return state.merge({
        'isLoading': true,
        'isError': false
      });
    case GET_USER_REQUEST:
      return state.set('isLoading', true);
    case CREATE_USER_SUCCESS:
      return state.merge({
        'isLoading': false,
        'isError': false
      });
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
    default:
      return state;
  }
}

// # Selectors
export const getUserId = state => state.registration.get('userId');
export const getUserName = state => state.registration.get('name');
export const getUserImageUrl = state => state.registration.get('image_url');
export const getUserTeamId = state => state.registration.get('selectedTeam', 0);
export const getUserTeam = createSelector(getUserTeamId, getTeams,
  (teamId, teams) => teams.find(item => item.get('id') === teamId))
