'user strict';

import DeviceInfo from 'react-native-device-info';

import {
  SEND_FEEDBACK_REQUEST,
  SEND_FEEDBACK_FAILURE,
  SEND_FEEDBACK_SUCCESS,
  SET_EVENT_ID,
  SET_GRADE,
  SET_TEXT_VALUES,
  RESET_FORM
} from '../actions/eventFeedback';

const initialState = {
  id: null,
  idSet: false,
  grade: 0,
  text: '',
  errorMsg: '',
  errorState: false,
  feedbackSent: false,
  uuid: DeviceInfo.getUniqueID()
};

const eventFeedback = (state = initialState, action) => {
  switch (action.type) {
    case SEND_FEEDBACK_REQUEST: {
      return {...state, errorState: false, errorMsg: '', feedbackSent: false}
    }
    case SEND_FEEDBACK_FAILURE: {
      return {...state, feedbackSent: false, errorState: true, errorMsg: action.payload}
    }
    case SEND_FEEDBACK_SUCCESS: {
      return {...state, feedbackSent: true}
    }
    case SET_EVENT_ID: {
      return {...state, id: action.payload, idSet: true}
    }
    case SET_GRADE: {
      return {...state, grade: action.payload}
    }
    case SET_TEXT_VALUES: {
      return {...state, text: action.payload}
    }
    case RESET_FORM: {
      return {...initialState}
    }
    default:
      return state;
  }
};

export default eventFeedback;