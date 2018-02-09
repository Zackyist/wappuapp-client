import DeviceInfo from 'react-native-device-info';
import api from '../services/api';
import namegen from '../services/namegen';
import _ from 'lodash';
import {createRequestActionTypes} from '.';
import { fetchUserProfile } from '../concepts/user';

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
  GET_BUDDY_USER_REQUEST,
  GET_BUDDY_USER_SUCCESS,
  GET_BUDDY_USER_FAILURE
} = createRequestActionTypes('GET_BUDDY_USER');
const {
  GET_LOOKING_FOR_TYPES_REQUEST,
  GET_LOOKING_FOR_TYPES_SUCCESS,
  GET_LOOKING_FOR_TYPES_FAILURE
} = createRequestActionTypes('GET_LOOKING_FOR_TYPES');
const {
  DELETE_BUDDY_PROFILE_REQUEST,
  DELETE_BUDDY_PROFILE_SUCCESS,
  DELETE_BUDDY_PROFILE_FAILURE}
= createRequestActionTypes('DELETE_BUDDY_PROFILE');

const OPEN_REGISTRATION_VIEW = 'OPEN_REGISTRATION_VIEW';
const CLOSE_REGISTRATION_VIEW = 'CLOSE_REGISTRATION_VIEW';
const UPDATE_NAME = 'UPDATE_NAME';
const RESET = 'RESET';
const SELECT_TEAM = 'SELECT_TEAM';
const CLOSE_TEAM_SELECTOR = 'CLOSE_TEAM_SELECTOR';
const DISMISS_INTRODUCTION = 'DISMISS_INTRODUCTION';
const UPDATE_PROFILE_PIC = 'UPDATE_PROFILE_PIC';
const ACKNOWLEDGE_DATA_UPDATE = 'ACKNOWLEDGE_DATA_UPDATE';
const CLOSE_BUDDY_INTRO_VIEW = 'CLOSE_BUDDY_INTRO_VIEW';
const CLOSE_BUDDY_REGISTRATION_VIEW = 'CLOSE_BUDDY_REGISTRATION_VIEW';
const OPEN_BUDDY_INTRO_VIEW = 'OPEN_BUDDY_INTRO_VIEW';
const OPEN_BUDDY_REGISTRATION_VIEW = 'OPEN_BUDDY_REGISTRATION_VIEW';
const SET_DATA_UPDATED = 'SET_DATA_UPDATED';
const SHOW_OTHER_BUDDY_PROFILE = 'SHOW_OTHER_BUDDY_PROFILE';
const SHOW_OWN_BUDDY_PROFILE = 'SHOW_OWN_BUDDY_PROFILE';
const UPDATE_BUDDY_BIO = 'UPDATE_BUDDY_BIO';
const UPDATE_BUDDY_CLASS_YEAR = 'UPDATE_BUDDY_CLASS_YEAR';
const UPDATE_BUDDY_LOOKING_FOR = 'UPDATE_BUDDY_LOOKING_FOR';
const UPDATE_BUDDY_PUSH_TOKEN = 'UPDATE_BUDDY_PUSH_TOKEN';
const UPDATE_BUDDY_REGISTRATION = 'UPDATE_BUDDY_REGISTRATION';

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
        dispatch({ type: SET_DATA_UPDATED });
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
        dispatch({ type: CREATE_USER_SUCCESS });
      })
      .catch(error => dispatch({ type: CREATE_USER_FAILURE, error: error }));
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
        dispatch(fetchUserProfile(user.id));
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

const acknowledgeDataUpdate = () => {
  return { type: ACKNOWLEDGE_DATA_UPDATE };
};

const broadcastDataUpdate = () => {
  return { type: SET_DATA_UPDATED };
};

const closeBuddyIntroView = () => {
  return { type: CLOSE_BUDDY_INTRO_VIEW };
};

const closeBuddyRegistrationView = () => {
  return { type: CLOSE_BUDDY_REGISTRATION_VIEW };
};

const deleteBuddyProfile = () => {
  return dispatch => {
    dispatch({ type: DELETE_BUDDY_PROFILE_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    console.log('ACTIONISSA')
    return api.deleteBuddyProfile(uuid)
      .then(response => {
        dispatch({ type: DELETE_BUDDY_PROFILE_SUCCESS });
        dispatch({ type: UPDATE_BUDDY_REGISTRATION, payload: false });
      })
      .catch(error => {
        dispatch({ type: DELETE_BUDDY_PROFILE_FAILURE, error: error });
      });
  };
};

// Used for getting the user's own profile and keeping it in store
const getBuddyUser = () => {
  return dispatch => {
    dispatch({ type: GET_BUDDY_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api.getBuddyUser(uuid)
      .then(buddyUser => {
        dispatch({ type: GET_BUDDY_USER_SUCCESS, payload: buddyUser });
      })
      .catch(error => {
        dispatch({ type: GET_BUDDY_USER_FAILURE, error: error });
      });
  };
};

const getLookingForTypes = () => (dispatch) => {
  dispatch({ type: GET_LOOKING_FOR_TYPES_REQUEST });
  return api.getLookingForTypes()
    .then(lookingForTypes => {
      dispatch({ type: GET_LOOKING_FOR_TYPES_SUCCESS, payload: lookingForTypes });
    })
    .catch(error => dispatch({ type: GET_LOOKING_FOR_TYPES_FAILURE, error: true, payload: error }));
}

const openBuddyIntroView = () => {
  return { type: OPEN_BUDDY_INTRO_VIEW };
};

const openBuddyRegistrationView = () => {
  return { type: OPEN_BUDDY_REGISTRATION_VIEW };
};

const putBuddyProfile = (onPutError) => {
  return (dispatch, getStore) => {
    dispatch({ type: CREATE_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const bio_text = getStore().registration.get('bio_text');
    const bio_looking_for_type_id = getStore().registration.get('bio_looking_for_type_id');
    const push_token = getStore().registration.get('push_token');
    const class_year = getStore().registration.get('class_year');
    return api.putBuddyProfile({ uuid, bio_text, bio_looking_for_type_id, push_token, class_year })
      .then(response => {
        dispatch({ type: CREATE_USER_SUCCESS });
        dispatch({ type: CLOSE_BUDDY_REGISTRATION_VIEW });
        dispatch({ type: UPDATE_BUDDY_REGISTRATION, payload: true });
        dispatch({ type: SET_DATA_UPDATED });
      })
      .catch(error => {
        dispatch({ type: CREATE_USER_FAILURE, error: error });
        onPutError();
      });
  };
};

const showOtherBuddyProfile = () => {
  return { type: SHOW_OTHER_BUDDY_PROFILE };
};

const showOwnBuddyProfile = () => {
  return { type: SHOW_OWN_BUDDY_PROFILE };
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

const updateBuddyRegistration = buddyRegistration => {
  return { type: UPDATE_BUDDY_REGISTRATION, payload: buddyRegistration };
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
  ACKNOWLEDGE_DATA_UPDATE,
  CLOSE_BUDDY_INTRO_VIEW,
  CLOSE_BUDDY_REGISTRATION_VIEW,
  DELETE_BUDDY_PROFILE_REQUEST,
  DELETE_BUDDY_PROFILE_SUCCESS,
  DELETE_BUDDY_PROFILE_FAILURE,
  GET_BUDDY_USER_REQUEST,
  GET_BUDDY_USER_SUCCESS,
  GET_BUDDY_USER_FAILURE,
  GET_LOOKING_FOR_TYPES_REQUEST,
  GET_LOOKING_FOR_TYPES_SUCCESS,
  GET_LOOKING_FOR_TYPES_FAILURE,
  OPEN_BUDDY_INTRO_VIEW,
  OPEN_BUDDY_REGISTRATION_VIEW,
  SET_DATA_UPDATED,
  SHOW_OTHER_BUDDY_PROFILE,
  SHOW_OWN_BUDDY_PROFILE,
  UPDATE_BUDDY_BIO,
  UPDATE_BUDDY_CLASS_YEAR,
  UPDATE_BUDDY_LOOKING_FOR,
  UPDATE_BUDDY_PUSH_TOKEN,
  UPDATE_BUDDY_REGISTRATION,
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
  acknowledgeDataUpdate,
  broadcastDataUpdate,
  closeBuddyIntroView,
  closeBuddyRegistrationView,
  deleteBuddyProfile,
  getBuddyUser,
  getLookingForTypes,
  openBuddyIntroView,
  openBuddyRegistrationView,
  putBuddyProfile,
  showOtherBuddyProfile,
  showOwnBuddyProfile,
  updateBuddyBio,
  updateBuddyClassYear,
  updateBuddyLookingFor,
  updateBuddyPushToken,
  updateBuddyRegistration
};
