// TODO: Remove pushToken hardcoding after the back-end and token generation have been fixed

import DeviceInfo from 'react-native-device-info';
import api from '../services/api';
import namegen from '../services/namegen';
import _ from 'lodash';
import {createRequestActionTypes} from '.';

const {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE
} = createRequestActionTypes('CREATE_USER');
const {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE
} = createRequestActionTypes('GET_USER');
const {
  GET_LOOKING_FOR_TYPES_REQUEST,
  GET_LOOKING_FOR_TYPES_SUCCESS,
  GET_LOOKING_FOR_TYPES_FAILURE
} = createRequestActionTypes('GET_LOOKING_FOR_TYPES');

const OPEN_REGISTRATION_VIEW = 'OPEN_REGISTRATION_VIEW';
const CLOSE_REGISTRATION_VIEW = 'CLOSE_REGISTRATION_VIEW';
const UPDATE_NAME = 'UPDATE_NAME';
const RESET = 'RESET';
const SELECT_TEAM = 'SELECT_TEAM';
const CLOSE_TEAM_SELECTOR = 'CLOSE_TEAM_SELECTOR';
const DISMISS_INTRODUCTION = 'DISMISS_INTRODUCTION';
const UPDATE_PROFILE_PIC = 'UPDATE_PROFILE_PIC';
const OPEN_BUDDY_REGISTRATION_VIEW = 'OPEN_BUDDY_REGISTRATION_VIEW';
const CLOSE_BUDDY_REGISTRATION_VIEW = 'CLOSE_BUDDY_REGISTRATION_VIEW';
const UPDATE_BUDDY_BIO = 'UPDATE_BUDDY_BIO';
const UPDATE_BUDDY_CLASS_YEAR = 'UPDATE_BUDDY_CLASS_YEAR';
const UPDATE_BUDDY_LOOKING_FOR = 'UPDATE_BUDDY_LOOKING_FOR';
const UPDATE_BUDDY_PUSH_TOKEN = 'UPDATE_BUDDY_PUSH_TOKEN';

const openRegistrationView = () => {
  return { type: OPEN_REGISTRATION_VIEW };
};

const closeRegistrationView = () => {
  return { type: CLOSE_REGISTRATION_VIEW };
};

const dismissIntroduction = () => {
  return { type: DISMISS_INTRODUCTION };
};

const putUser = () => {
  return (dispatch, getStore) => {
    dispatch({ type: CREATE_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const name = getStore().registration.get('name');
    const team = getStore().registration.get('selectedTeam');
    return api.putUser({ uuid, name, team })
      .then(response => {
        dispatch({ type: CREATE_USER_SUCCESS });
        dispatch({ type: CLOSE_REGISTRATION_VIEW });
      })
      .catch(error => dispatch({ type: CREATE_USER_FAILURE, error: error }));
  };
};

const putProfilePic = () => {
  return (dispatch, getStore) => {
    dispatch({ type: CREATE_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const imageData = getStore().registration.get('profilePic');
    return api.putProfilePic({ uuid, imageData })
      .then(response => {
        dispatch({type: CREATE_USER_SUCCESS})
      })
      .catch(error => dispatch({type: CREATE_USER_FAILURE, error: error}));
  };
};

const selectTeam = team => {
  return (dispatch, getStore) => {
    const teams = getStore().team.get('teams').toJS();
    const currentName = getStore().registration.get('name');
    const currentTeam = _.find(teams, ['id', team]);

    dispatch({ type: CLOSE_TEAM_SELECTOR });
    dispatch({ type: SELECT_TEAM, payload: team });
    // Generate new name if not given name
    if (!currentName) {
      dispatch({ type: UPDATE_NAME, payload: namegen.generateName(currentTeam.name) });
    }
  };
};

const updateName = name => {
  return { type: UPDATE_NAME, payload: name };
};

const reset = () => {
  return { type: RESET };
};

const generateName = () => {
  return (dispatch, getStore) => {
    const currentTeamId = getStore().registration.get('selectedTeam');

    if (currentTeamId) {
      const teams = getStore().team.get('teams').toJS();
      const selectedTeam = _.find(teams, ['id', currentTeamId]);
      if (selectedTeam) {
        dispatch({ type: UPDATE_NAME, payload: namegen.generateName(selectedTeam.name) });
      }
    }
  };
};

const getUser = () => {
  return dispatch => {
    dispatch({ type: GET_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api.getUser(uuid)
      .then(user => {
        dispatch({ type: GET_USER_SUCCESS, payload: user });
      })
      .catch(error => {
        dispatch({ type: GET_USER_FAILURE, error: error });
      });
  };
};

const updateProfilePic = (profilePic) => {
  return {type: UPDATE_PROFILE_PIC, payload: profilePic};
}

// WhappuBuddy registration and profile editing actions begin

const openBuddyRegistrationView = () => {
  return { type: OPEN_BUDDY_REGISTRATION_VIEW };
};

const closeBuddyRegistrationView = () => {
  return { type: CLOSE_BUDDY_REGISTRATION_VIEW };
};

const getLookingForTypes = () => (dispatch) => {
  dispatch({ type: GET_LOOKING_FOR_TYPES_REQUEST });
  return api.getLookingForTypes()
    .then(lookingForTypes => {
      dispatch({ type: GET_LOOKING_FOR_TYPES_SUCCESS, payload: lookingForTypes });
    })
    .catch(error => dispatch({ type: GET_LOOKING_FOR_TYPES_FAILURE, error: true, payload: error }));
}

const putBuddyProfile = () => {
  return (dispatch, getStore) => {
    dispatch({ type: CREATE_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const bio_text = getStore().registration.get('bio_text');
    const bio_looking_for_type_id = getStore().registration.get('bio_looking_for_type_id');
    // TODO: Replace this one with the commented-out ones below - after 
    //       the push token is properly generated somewhere in the client
    const pushToken = "INVALID";
    //const pushToken = getStore().registration.get('pushToken');
    const class_year = getStore().registration.get('class_year');
    return api.putBuddyProfile({ uuid, bio_text, bio_looking_for_type_id, pushToken, class_year })
      .then(response => {
        dispatch({type: CREATE_USER_SUCCESS});
        dispatch({ type: CLOSE_BUDDY_REGISTRATION_VIEW });
      })
      .catch(error => dispatch({type: CREATE_USER_FAILURE, error: error}));
  };
};

const updateBuddyBio = buddyBio => {
  return { type: UPDATE_BUDDY_BIO, payload: buddyBio };
};

const updateBuddyClassYear = buddyClassYear => {
  return { type: UPDATE_BUDDY_CLASS_YEAR, payload: buddyClassYear };
};

const updateBuddyLookingFor = buddyLookingFor => {
  return { type: UPDATE_BUDDY_LOOKING_FOR, payload: buddyLookingFor };
};

const updateBuddyPushToken = buddyPushToken => {
  return { type: UPDATE_BUDDY_PUSH_TOKEN, payload: buddyPushToken };
};

// WhappuBuddy registration and profile editing actions end

export {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  OPEN_REGISTRATION_VIEW,
  CLOSE_REGISTRATION_VIEW,
  UPDATE_NAME,
  UPDATE_PROFILE_PIC,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  SELECT_TEAM,
  RESET,
  DISMISS_INTRODUCTION,
  OPEN_BUDDY_REGISTRATION_VIEW,
  CLOSE_BUDDY_REGISTRATION_VIEW,
  GET_LOOKING_FOR_TYPES_REQUEST,
  GET_LOOKING_FOR_TYPES_SUCCESS,
  GET_LOOKING_FOR_TYPES_FAILURE,
  UPDATE_BUDDY_BIO,
  UPDATE_BUDDY_CLASS_YEAR,
  UPDATE_BUDDY_LOOKING_FOR,
  UPDATE_BUDDY_PUSH_TOKEN,
  putUser,
  updateProfilePic,
  putProfilePic,
  openRegistrationView,
  closeRegistrationView,
  updateName,
  generateName,
  getUser,
  selectTeam,
  reset,
  dismissIntroduction,
  openBuddyRegistrationView,
  closeBuddyRegistrationView,
  getLookingForTypes,
  putBuddyProfile,
  updateBuddyBio,
  updateBuddyClassYear,
  updateBuddyLookingFor,
  updateBuddyPushToken
};
