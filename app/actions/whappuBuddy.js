import api from '../services/api';
import {createRequestActionTypes} from '.';



const DELETE_BUDDY_PROFILE
 = createRequestActionTypes('DELETE_BUDDY_PROFILE');


// const deleteBuddyProfile = () => {
//   return dispatch => {
//     dispatch({ type: DELETE_BUDDY_PROFILE_REQUEST });
//     const uuid = DeviceInfo.getUniqueID();
//     return api.deleteBuddyProfile(uuid)
//       .then(user => {
//         dispatch({ type: DELETE_BUDDY_PROFILE_SUCCESS});
//       })
//       .catch(error => {
//         dispatch({ type: DELETE_BUDDY_PROFILE_FAILURE, error: error });
//       });
//   };
// };

const deleteBuddyProfile = () => {
  return dispatch => {
    return api.deleteBuddyProfile()
      .then(() => dispatch({
        type: DELETE_BUDDY_PROFILE,
      }))
      .catch(error => console.log('Error when trying to delete buddy profile', error));
  };
};


export {
  DELETE_BUDDY_PROFILE,
  deleteBuddyProfile
}
