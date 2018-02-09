'use strict';

import {
  FETCH_CHAT_REQUEST,
  FETCH_CHAT_FAILURE,
  FETCH_CHAT_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_SUCCESS,
  OPEN_CHAT_VIEW,
  CLOSE_CHAT_VIEW,
  UPDATE_CHAT_INFO
} from '../actions/chat';
import { FETCH_BUDDY_FAILURE } from '../actions/matches';

const initialState = {
  database: null,
  messages: [],
  myId: null,
  buddyId: null,
  buddyImg: null,
  buddyName: null,
  chatId: null,
  fetching: false,
  fetchReady: false,
  fetchError: false,
  errorMsg: '',
  isChatViewOpen: false
};

const chat = (state = initialState, action) => {
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
      return {...state, errorMsg: action.payload}
    }
    case SEND_MESSAGE_SUCCESS: {
      return {...state}
    }
    case OPEN_CHAT_VIEW: {
      return {...state, isChatViewOpen: true};
    }
    case CLOSE_CHAT_VIEW: {
      return {...state, isChatViewOpen: false};
    }
    case UPDATE_CHAT_INFO: {
      return {
        ...state,
        myId: action.payload.myId,
        buddyId: action.payload.buddyId,
        buddyName: action.payload.buddyName,
        buddyImg: action.payload.buddyImg,
        chatId: action.payload.chatId,
      }
    }
    default:
      return state;
  }
};

// # Selectors
export const isChatViewOpen = state => state.chat.isChatViewOpen;
export const isFetchReady = state => state.chat.fetchReady;
export const getDatabase = state => state.chat.database;
export const getMessages = state => state.chat.messages;
export const getMyId = state => state.chat.myId;
export const getBuddyId = state => state.chat.buddyId;
export const getBuddyImg = state => state.chat.buddyImg;
export const getBuddyName = state => state.chat.buddyName;
export const getChatId = state => state.chat.chatId;
export const isFetching = state => state.chat.fetching;
export const getFetchError = state => state.chat.fetchError;
export const getErrorMsg = state => state.chat.errorMsg;

export default chat;
