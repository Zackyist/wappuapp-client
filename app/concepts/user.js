import { createSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { parseInt } from 'lodash';
import DeviceInfo from 'react-native-device-info';

import api from '../services/api';
import {createRequestActionTypes} from '../actions';
import { VOTE_FEED_ITEM_REQUEST } from '../actions/feed';


// # Selectors
export const getUserImages = state => state.user.getIn(['profile', 'images'], List()) || List();
export const getUserTeam = state => state.user.getIn(['profile', 'team'], List()) || List();
export const getTotalSimas = state => state.user.getIn(['profile', 'numSimas'], '') || '';
export const getSelectedUser = state => state.user.get('selectedUser', Map()) || Map();
export const isLoadingUserImages = state => state.user.get('isLoading', false) || false;
export const getUserImageUrl = state => state.user.getIn(['profile', 'image_url'], '') || '';
export const getUserBuddies = state => state.user.get('buddies') || List([]);
export const hasRegisteredOnWhappuBuddy = state => state.user.getIn(['profile', 'heila'], false) || false;

export const getTotalVotesForUser = createSelector(
  getUserImages, (posts) => {
    const sumOfVotes = posts.reduce(
      (total, post) => total + parseInt(post.get('votes', 0), 10),
      0
    );
    return sumOfVotes;
  }
)

// # Action creators
const {
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAILURE
} = createRequestActionTypes('GET_USER_PROFILE');
const SET_USER_PROFILE = 'SET_USER_PROFILE';

const {
  GET_USER_BUDDY_REQUEST,
  GET_USER_BUDDY_SUCCESS,
  GET_USER_BUDDY_FAILURE
} = createRequestActionTypes('GET_USER_BUDDY');
const SET_USER_BUDDY = 'SET_USER_BUDDY';

const {
  PUT_OPINION_REQUEST,
  PUT_OPINION_SUCCESS,
  PUT_OPINION_FAILURE
} = createRequestActionTypes('PUT_OPINION');

const {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
} = createRequestActionTypes('GET_USER');
const SET_USER = 'SET_USER';

export const fetchUserProfile = (userId) => (dispatch) => {
  dispatch({ type: GET_USER_PROFILE_REQUEST });
  return api.getUserProfile(userId)
    .then( userProfile => {
      dispatch({
        type: SET_USER_PROFILE,
        payload: userProfile
      });
      dispatch({ type: GET_USER_PROFILE_SUCCESS });
    })
    .catch(error => dispatch({ type: GET_USER_PROFILE_FAILURE, error: true, payload: error }));
}

export const fetchUserImages = (userId) => (dispatch) => {
  dispatch({ type: GET_USER_PROFILE_REQUEST });
  return api.getUserProfile(userId)
    .then(images => {
      dispatch({
        type: SET_USER_PROFILE,
        payload: images
      });
      dispatch({ type: GET_USER_PROFILE_SUCCESS });
    })
    .catch(error => dispatch({ type: GET_USER_PROFILE_FAILURE, error: true, payload: error }));
}

export const fetchUserBuddies = () => {
  return dispatch => {
    dispatch({ type: GET_USER_BUDDY_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api.getBuddies(uuid)
      .then(buddies => {
        dispatch({
           type: SET_USER_BUDDY,
           payload: buddies
       });
       dispatch({ type: GET_USER_BUDDY_SUCCESS});
      })
      .catch(error => {
        dispatch({ type: GET_USER_BUDDY_FAILURE, error: true, payload: error });
      });
  };
};

export const submitOpinion = (params) => {
  return (dispatch) => {
    return api.postOpinion(params)
    .then(response => {
      dispatch({type: PUT_OPINION_SUCCESS});
      //dispatch({type: CLOSE_MATCH_VIEW});
    })
    .catch(error => dispatch({type: PUT_OPINION_FAILURE, error: error}))
  }
}

// # Reducer
const initialState = fromJS({
  profile: {},
  isLoading: false,
  selectedUser: null,
  user: {},
  buddies: [],
});

export default function city(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE: {
      return state.set('profile', fromJS(action.payload));
    }

    case SET_USER_BUDDY: {
      return state.set('buddies', List(action.payload));
    }

    case GET_USER_BUDDY_REQUEST: {
      return state.merge({
        buddies: Map(),
        isLoading: true
      });
    }

    case GET_USER_SUCCESS:

    case GET_USER_PROFILE_REQUEST: {
      return state.merge({
        profile: Map(),
        isLoading: true
      });
     }
    case SET_USER: {
      return state.set('user', fromJS(action.payload));
    }

  case GET_USER_SUCCESS:

  case GET_USER_REQUEST: {
    return state.merge({
      user: Map(),
      isLoading: true
    });
  }

    case GET_USER_FAILURE: {
      return state.set('isLoading', false)
    }

    case GET_USER_PROFILE_SUCCESS:
    case GET_USER_PROFILE_FAILURE: {
      return state.set('isLoading', false);
    }

    case GET_USER_BUDDY_FAILURE: {
      return state.set('isLoading', false);
    }

    case VOTE_FEED_ITEM_REQUEST: {
      const list = state.getIn(['profile', 'images'], List());
      const voteItemIndex = list.findIndex((item) => item.get('id') === action.feedItemId);
      if (voteItemIndex < 0) {
        return state;
      } else {
        return state.mergeIn(['profile', 'images', voteItemIndex], {
          'userVote': action.value,
          'votes': action.votes
        });
      }
    }


    default: {
      return state;
    }
  }
}
