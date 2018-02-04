'use strict';

import {
  FETCH_CHAT_REQUEST,
  FETCH_CHAT_FAILURE,
  FETCH_CHAT_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_SUCCESS
} from '../actions/chat';
import { FETCH_BUDDY_FAILURE } from '../actions/matches';

const initialState = {
  messages: [],
  myId: null,
  buddyId: null,
  buddyImg: null,
  chatId: null,
  fetching: false,
  fetchReady: false,
  fetchError: false,
  errorMsg: ''
};

const chat = (state=initialState, action) => {
  switch (action.type) {
    case FETCH_CHAT_REQUEST: {
      return {...state, fetching: true, fetchReady: false}
    }
    case FETCH_CHAT_FAILURE: {
      return {...state, fetching: false, fetchError: true, errorMsg: action.payload}
    }
    case FETCH_CHAT_SUCCESS: {
      return {...state, fetching: false, fetchReady: true, messages: action.payload}
    }
    case SEND_MESSAGE_FAILURE: {
      return {...state, errorMsg: error}
    }
    case SEND_MESSAGE_SUCCESS: {
      return {...state}
    }
    default:
      return state;
  }
};

export default chat;
