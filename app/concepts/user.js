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
// TODO: Fix hasRegisteredOnWhappuBuddy once the backend fix has been applied
export const hasRegisteredOnWhappuBuddy = state => true;
// export const hasRegisteredOnWhappuBuddy = state => state.user.get(['profile', 'heila'], false) || false;

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

// # Reducer
const initialState = fromJS({
  profile: {},
  isLoading: false,
  selectedUser: null,
  user: {}
});

export const submitOpinion = (params) => {
  return (dispatch) => {
    console.log("DEBUG: " + params.userId + " " + params.opinion)
    dispatch({type: PUT_OPINION_REQUEST});
    console.log("DEBUG: user.js " + params.opinion);
    return api.postOpinion(params)
    .then(response => {
      dispatch({type: PUT_OPINION_SUCCESS});
      //dispatch({type: CLOSE_MATCH_VIEW});
    })
    .catch(error => dispatch({type: PUT_OPINION_FAILURE, error: error}))
  }
}

export default function city(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE: {
      return state.set('profile', fromJS(action.payload));
    }

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