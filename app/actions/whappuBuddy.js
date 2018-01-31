import api from '../services/api';
import {createRequestActionTypes} from '.';
import DeviceInfo from 'react-native-device-info';


const {DELETE_BUDDY_PROFILE_REQUEST,
      DELETE_BUDDY_PROFILE_SUCCESS,
      DELETE_BUDDY_PROFILE_FAILURE}
 = createRequestActionTypes('DELETE_BUDDY_PROFILE');


const deleteBuddyProfile = () => {
  return dispatch => {
    dispatch({ type: DELETE_BUDDY_PROFILE_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    console.log('ACTIONISSA')
    return api.deleteBuddyProfile(uuid)
      .then(response => {
        dispatch({ type: DELETE_BUDDY_PROFILE_SUCCESS});
      })
      .catch(error => {
        dispatch({ type: DELETE_BUDDY_PROFILE_FAILURE, error: error });
      });
  };
};

// const deleteBuddyProfile = () => {
//   return dispatch => {
//     return api.deleteBuddyProfile()
//       .then(() => dispatch({
//         type: DELETE_BUDDY_PROFILE,
//       }))
//       .catch(error => console.log('Error when trying to delete buddy profile', error));
//   };
// };


export {
  DELETE_BUDDY_PROFILE_REQUEST,
  DELETE_BUDDY_PROFILE_SUCCESS,
  DELETE_BUDDY_PROFILE_FAILURE,
  deleteBuddyProfile
}
