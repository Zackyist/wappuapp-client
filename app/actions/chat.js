'use strict';

import * as firebase from 'firebase';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fi';

moment.locale('fi');

export const FETCH_CHAT_REQUEST = 'FETCH_CHAT_REQUEST';
export const FETCH_CHAT_FAILURE = 'FETCH_CHAT_FAILURE';
export const FETCH_CHAT_SUCCESS = 'FETCH_CHAT_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const OPEN_CHAT_VIEW = 'OPEN_CHAT_VIEW';
export const CLOSE_CHAT_VIEW = 'CLOSE_CHAT_VIEW';
export const UPDATE_CHAT_INFO = 'UPDATE_CHAT_INFO';

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

export const fetchChat = (chatId, db, buddyName, buddyImg) => {
  return async dispatch => {
    dispatch(fetchChatRequest());
    try {
      await db.ref(`chats/${chatId}/messages`).on('value', (messages) => {
        const messageList = []
        messages.forEach(message => {
          const msg = message.val();
          let name = 'Me';
          let url = null;
          if (Number(msg.userId) === -1) {
            name = 'WhappuBuddy Admin';
            url = null;
          }
          else {
            name = buddyName;
            url = buddyImg;
          }
          messageList.push({
            _id: message.key,
            text: msg.msg,
            createdAt: msg.createdAt,
            user: {
              _id: Number(msg.userId),
              name: name,
              avatar: url
            }
          });
        });
      dispatch(fetchChatSuccess(messageList.reverse()));
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

export const sendMessageFailure = (error) => ({
  type: SEND_MESSAGE_FAILURE,
  payload: error
});

export const sendMessage = (id, msg, chatId, database) => {
  return dispatch => {
    try {
      const createdAt = moment().valueOf();
      const userId = id.toString();
      database.ref(`chats/${chatId}/messages`).push({
        msg,
        createdAt,
        userId
      });
      dispatch(sendMessageSuccess());
    }
    catch (error) {
      dispatch(sendMessageFailure(error));
    }
  };
};

export const closeChatView = () => {
  return { type: CLOSE_CHAT_VIEW };
};

export const openChatView = () => {
  return { type: OPEN_CHAT_VIEW };
};

export const updateChatInfo = item => {
  return { type: UPDATE_CHAT_INFO, payload: item };
};
