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
export const getUserImageUrl = state => state.user.getIn(['user', 'image_url'], '') || '';

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
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
} = createRequestActionTypes('GET_USER');
const SET_USER = 'SET_USER';

export const fetchUserImages = (userId) => (dispatch) => {
  dispatch({ type: GET_USER_PROFILE_REQUEST });
  return api.getUserProfile(userId)
    .then( image_url => {
      dispatch({
        type: SET_USER_PROFILE,
        payload: image_url
      });
      dispatch({ type: GET_USER_PROFILE_SUCCESS });
    })
    .catch(error => dispatch({ type: GET_USER_PROFILE_FAILURE, error: true, payload: error }));
}

export const fetchUserAvatarUrl  = () => {
  return dispatch => {
    dispatch({ type: GET_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
  return api.getUser(uuid)
    .then(user=> {
      dispatch({
        type: SET_USER,
        payload: user
      });
      dispatch({ type: GET_USER_SUCCESS });
    })
    .catch(error => dispatch({ type: GET_USER_FAILURE, error: error }));
  }
}

// # Reducer
const initialState = fromJS({
  profile: {},
  isLoading: false,
  selectedUser: null,
  user: {}
});

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
