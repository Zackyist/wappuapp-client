'use strict';

import api from '../services/api';

export const SEND_FEEDBACK_REQUEST = 'SEND_FEEDBACK_REQUEST';
export const SEND_FEEDBACK_FAILURE = 'SEND_FEEDBACK_FAILURE';
export const SEND_FEEDBACK_SUCCESS = 'SEND_FEEDBACK_SUCCESS';
export const SET_EVENT_ID = 'SET_EVENT_ID';
export const SET_GRADE = 'SET_GRADE';
export const SET_TEXT_VALUES = 'SET_TEXT_VALUES';
export const RESET_FORM = 'RESET_FORM';

export const sendFeedbackRequest = () => ({
  type: SEND_FEEDBACK_REQUEST
});

export const sendFeedbackFailure = (error) => ({
  type: SEND_FEEDBACK_FAILURE,
  payload: error
});

export const sendFeedbackSuccess = () => ({
  type: SEND_FEEDBACK_SUCCESS
});

export const sendEventFeedback = (feedback) => {
  return dispatch => {
    dispatch(sendFeedbackRequest());
    return api.postFeedback(feedback)
      .then(response => {
        dispatch(sendFeedbackSuccess());
      })
      .catch(error => dispatch(sendFeedbackFailure(error)));
  };
};

export const setIdRequest = (eventId) => ({
  type: SET_EVENT_ID,
  payload: eventId
});

export const setEventId = (eventId) => {
  return dispatch => {
    dispatch(setIdRequest(eventId));
  };
};

export const setGradeRequest = (grade) => ({
  type: SET_GRADE,
  payload: grade
});

export const setGrade = (grade) => {
  return dispatch => {
    dispatch(setGradeRequest(grade));
  }
};

export const setTextValue = (text) => ({
  type: SET_TEXT_VALUES,
  payload: text
});

export const setText = (text) => {
  return dispatch => {
    dispatch(setTextValue(text));
  };
};

export const resetRequest = () => ({
  type: RESET_FORM
});

export const resetForm = () => {
  return dispatch => {
    dispatch(resetRequest());
  };
};