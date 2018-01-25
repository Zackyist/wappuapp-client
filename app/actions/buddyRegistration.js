import DeviceInfo from 'react-native-device-info';
import api from '../services/api';
import _ from 'lodash';
import {createRequestActionTypes} from '.';

const {
  CREATE_BUDDY_PROFILE_REQUEST,
  CREATE_BUDDY_PROFILE_SUCCESS,
  CREATE_BUDDY_PROFILE_FAILURE
} = createRequestActionTypes('CREATE_BUDDY_PROFILE');
const {
  GET_BUDDY_PROFILE_REQUEST,
  GET_BUDDY_PROFILE_SUCCESS,
  GET_BUDDY_PROFILE_FAILURE
} = createRequestActionTypes('GET_BUDDY_PROFILE');

const OPEN_BUDDY_REGISTRATION_VIEW = 'OPEN_BUDDY_REGISTRATION_VIEW';
const CLOSE_BUDDY_REGISTRATION_VIEW = 'CLOSE_BUDDY_REGISTRATION_VIEW';
const UPDATE_BIO = 'UPDATE_BIO';
const UPDATE_LOOKING_FOR = 'UPDATE_LOOKING_FOR';
const RESET = 'RESET';
const DISMISS_INTRODUCTION = 'DISMISS_INTRODUCTION';

const openBuddyRegistrationView = () => {
  return { type: OPEN_BUDDY_REGISTRATION_VIEW };
};

const closeBuddyRegistrationView = () => {
  return { type: CLOSE_BUDDY_REGISTRATION_VIEW };
};

const dismissIntroduction = () => {
  return { type: DISMISS_INTRODUCTION };
};

const putBuddyProfile = () => {
  return (dispatch, getStore) => {
    dispatch({ type: CREATE_BUDDY_PROFILE_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const bio = getStore().buddyRegistration.get('bio_text');
    const lookingFor = getStore().buddyRegistration.get('bio_looking_for');
    const pushToken = getStore().buddyRegistration.get('pushToken');
    return api.putBuddyProfile({ uuid, bio, lookingFor, pushToken })
      .then(response => {
        dispatch({ type: CREATE_BUDDY_PROFILE_SUCCESS });
        dispatch({ type: CLOSE_BUDDY_REGISTRATION_VIEW });
      })
      .catch(error => dispatch({ type: CREATE_BUDDY_PROFILE_FAILURE, error: error }));
  };
};

const putLookingFor = () => {
  return (dispatch, getStore) => {
    dispatch({ type: CREATE_BUDDY_PROFILE_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const lookingFor = getStore().buddyRegistration.get('lookingFor');
    return api.putLookingFor({ uuid, lookingFor })
      .then(response => {
        dispatch({type: CREATE_BUDDY_PROFILE_SUCCESS})
      })
      .catch(error => dispatch({type: CREATE_BUDDY_PROFILE_FAILURE, error: error}));
  };
};

const updateBio = bio => {
  return { type: UPDATE_BIO, payload: bio };
};

const updateLookingFor = (lookingFor) => {
  return {type: UPDATE_LOOKING_FOR, payload: lookingFor};
}

const reset = () => {
  return { type: RESET };
};

const getBuddyProfile = () => {
  return dispatch => {
    dispatch({ type: GET_BUDDY_PROFILE_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api.getBuddyProfile(uuid)
      .then(buddyProfile => {
        dispatch({ type: GET_BUDDY_PROFILE_SUCCESS, payload: buddyProfile });
      })
      .catch(error => {
        dispatch({ type: GET_BUDDY_PROFILE_FAILURE, error: error });
      });
  };
};

export {
  CREATE_BUDDY_PROFILE_REQUEST,
  CREATE_BUDDY_PROFILE_SUCCESS,
  CREATE_BUDDY_PROFILE_FAILURE,
  OPEN_BUDDY_REGISTRATION_VIEW,
  CLOSE_BUDDY_REGISTRATION_VIEW,
  UPDATE_BIO,
  UPDATE_LOOKING_FOR,
  GET_BUDDY_PROFILE_REQUEST,
  GET_BUDDY_PROFILE_SUCCESS,
  GET_BUDDY_PROFILE_FAILURE,
  RESET,
  DISMISS_INTRODUCTION,
  putBuddyProfile,
  putLookingFor,
  updateBio,
  updateLookingFor,
  openBuddyRegistrationView,
  closeBuddyRegistrationView,
  getBuddyProfile,
  reset,
  dismissIntroduction
};
