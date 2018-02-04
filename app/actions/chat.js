'use strict';

import firebase from 'firebase';
import _ from 'lodash';

// const database = firebase.database();

export const FETCH_CHAT_REQUEST = 'FETCH_CHAT_REQUEST';
export const FETCH_CHAT_FAILURE = 'FETCH_CHAT_FAILURE';
export const FETCH_CHAT_SUCCESS = 'FETCH_CHAT_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';

export const fetchChatRequest = () => ({
  type: FETCH_CHAT_REQUEST
});

export const fetchChatFailure = (error) => ({
  type: FETCH_CHAT_FAILURE,
  payload: error
});

export const fetchChatSuccess = (messages) => ({
  type: FETCH_CHAT_SUCCESS,
  payload: messages
});

export const fetchChat = (chatId) => {
  return async dispatch => {
    dispatch(fetchChatRequest());
    try {
      await database.ref(`chats/${chatId}/messages`).on('value', (messages) => {
        dispatch(fetchChatSuccess(JSON.stringify(messages1)))
    });
    }
    catch (error) {
      await dispatch(fetchChatFailure(error));
    }
  };
};

export const sendMessageSuccess = () => ({
  type: SEND_MESSAGE_SUCCESS
});

export const sendMessageFailure = () => ({
  type: SEND_MESSAGE_FAILURE,
  payload: error
});

export const sendMessage = (userId, msg, chatId) => {
  return async dispatch => {
    try {
      const ts = firebase.database.ServerValue.TIMESTAMP;
      await database.ref(`chats/${chatId}/messages`).push({
        msg,
        ts,
        userId
      });
      await dispatch(sendMessageSuccess());
    }
    catch (error) {
      dispatch(sendMessageFailure(error));
    }
  };
}