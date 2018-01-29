import api from '../services/api';
import {createRequestActionTypes} from '.';
import DeviceInfo from 'react-native-device-info';
// REQU-constit ja exportti


const {
  DELETE_BUDDY_PROFILE_REQUEST,
  DELETE_BUDDY_PROFILE_SUCCESS,
  DELETE_BUDDY_PROFILE_FAILURE
} = createRequestActionTypes('DELETE_BUDDY_PROFILE');


const deleteBuddyProfile = () => {
  return dispatch => {
    dispatch({ type: DELETE_BUDDY_PROFILE_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api.deleteBuddyProfile(uuid)
      .then(user => {
        dispatch({ type: DELETE_BUDDY_PROFILE_SUCCESS});
      })
      .catch(error => {
        dispatch({ type: DELETE_BUDDY_PROFILE_FAILURE, error: error });
      });
  };
};


export {
  DELETE_BUDDY_PROFILE_FAILURE,
  DELETE_BUDDY_PROFILE_SUCCESS,
  DELETE_BUDDY_PROFILE_REQUEST,
  deleteBuddyProfile
}
