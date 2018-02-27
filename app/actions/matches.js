'use strict';

import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import Endpoints from '../constants/Endpoints';

import api from '../services/api';
import { getUserId } from '../reducers/registration';

export const FETCH_MATCHES_REQUEST = 'FETCH_MATCHES_REQUEST';
export const FETCH_MATCHES_SUCCESS = 'FETCH_MATCHES_SUCCESS';
export const FETCH_MATCHES_FAILURE = 'FETCH_MATCHES_FAILURE';

export const FETCH_BUDDY_REQUEST = 'FETCH_BUDDY_REQUEST';
export const FETCH_BUDDY_SUCCESS = 'FETCH_BUDDY_SUCCESS';
export const FETCH_BUDDY_FAILURE = 'FETCH_BUDDY_FAILURE';

export const FETCH_ALL_BUDDIES_SUCCESS = 'FETCH_ALL_BUDDIES_SUCCESS';

export const UPDATE_DATASOURCE_REQUEST = 'UPDATE_DATASOURCE_REQUEST';
export const UPDATE_DATASOURCE_SUCCESS = 'UPDATE_DATASOURCE_SUCCESS';
export const UPDATE_DATASOURCE_FAILURE = 'UPDATE_DATASOURCE_FAILURE';

export const SET_LIST_READY = 'SET_LIST_READY';
export const RESET_MATCHES = 'RESET_MATCHES';

export const fetchingMatchesRequest = () => ({
  type: FETCH_MATCHES_REQUEST
});

export const fetchingMatchesSuccess = (matches) => ({
  type: FETCH_MATCHES_SUCCESS,
  payload: matches
});

export const fetchingMatchesFailure = (error) => ({
  type: FETCH_MATCHES_FAILURE,
  payload: error
});

export const fetchingMatches = () => {  
  return dispatch => {
    dispatch({ type: FETCH_MATCHES_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api.getMatches(uuid)
      .then(matches => {
        dispatch({ type: FETCH_MATCHES_SUCCESS, payload: matches });
      })
      .catch(error => {
        dispatch({ type: FETCH_MATCHES_FAILURE, error: error });
      });
  };
};

export const fetchingBuddyRequest = () => ({
  type: FETCH_BUDDY_REQUEST
});

export const fetchingBuddySuccess = (buddy) => ({
  type: FETCH_BUDDY_SUCCESS,
  payload: buddy
});

export const fetchingBuddyFailure = (error) => ({
  type: FETCH_BUDDY_FAILURE,
  payload: error
});


export const fetchAllBuddies = (matches,) => {
  console.log("fetchAllBuddies matches:")
  console.log(matches)

  return async (dispatch, getStore) => {
    for (let i = 0; i < matches.length; i++) {
      console.log("Inside fetchAllBuddies loop")

      // Find the user's own id
      let buddyId = matches[i].userId1;
      if (buddyId !== await getUserId(getStore())) {
        buddyId = matches[i].userId2;
      }
      await dispatch(fetchingBuddy(buddyId));
    }
    await dispatch(setBuddiesAsFetched());
  }
};

export const fetchingBuddy = (match) => {
  return async dispatch => {
    dispatch(fetchingBuddyRequest());
    try {
      let url = Endpoints.urls.userProfile(match);
      let response = await fetch(url);
      let buddy = await response.json();
      await dispatch(fetchingBuddySuccess(buddy));
    }
    catch (error) {
      dispatch(fetchingBuddyFailure(error));
    }
  };
};

export const setBuddiesAsFetched = () => {
  return { type: FETCH_ALL_BUDDIES_SUCCESS };
};

export const updateDatasourceRequest = () => ({
  type: UPDATE_DATASOURCE_REQUEST
});

export const updateDatasourceSuccess = (datasource) => ({
  type: UPDATE_DATASOURCE_SUCCESS,
  payload: datasource
});

export const updateDatasourceFailure = (error) => ({
  type: UPDATE_DATASOURCE_FAILURE,
  payload: error
});

export const updateDatasource = (matches, buddies) => {
  return (dispatch, getStore) => {
    dispatch(updateDatasourceRequest());
    let datasource = []
    try {
      _.zipWith(matches, buddies, (match, buddy) => {
        const buddyName = buddy.name;
        const buddyImg = buddy.image_url;
        const chatId = match.firebaseChatId;
        
        // Find the user's own id
        let myId = match.userId1;
        let buddyId = match.userId2;
        
        if (matches.userId2 === getUserId(getStore())) {
          myId = match.userId2;
          buddyId = match.userId1;
        }
        
        datasource.push({ myId, buddyId, buddyName, buddyImg, chatId });
      });
      dispatch(updateDatasourceSuccess(datasource));
    }
    catch (error) {
      dispatch(updateDatasourceFailure(error));
    }
  };
};

export const listReady = () => ({
  type: SET_LIST_READY
});

export const finishList = () => {
  return dispatch => {
    dispatch(listReady());
  };
};

export const matchReset = () => ({
  type: RESET_MATCHES
});

export const resetMatchlist = () => {
  return dispatch => {
    dispatch(matchReset());
  };
};
