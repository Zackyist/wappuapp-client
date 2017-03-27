'use strict';
import Immutable from 'immutable';

import {
  SET_EVENT_LIST,
  GET_EVENT_LIST_REQUEST,
  GET_EVENT_LIST_SUCCESS,
  GET_EVENT_LIST_FAILURE,
  UPDATE_EVENT_SHOWFILTER,
  TOGGLE_EVENT_MAP_LOCATE,
  SET_EVENT_IMAGES,
  GET_EVENT_IMAGES_REQUEST,
  GET_EVENT_IMAGES_SUCCESS,
  GET_EVENT_IMAGES_FAILURE
} from '../actions/event';

const initialState = Immutable.fromJS({
  list: [],
  listState: 'none',
  showFilter: '24H',
  locateMe: false,
  images: []
});

export default function event(state = initialState, action) {
  switch (action.type) {
    case SET_EVENT_LIST:
      return state.set('list', Immutable.fromJS(action.payload));
    case GET_EVENT_LIST_REQUEST:
      return state.set('listState', 'loading');
    case GET_EVENT_LIST_SUCCESS:
      return state.set('listState', 'ready');
    case GET_EVENT_LIST_FAILURE:
      return state.set('listState', 'failed');
    case UPDATE_EVENT_SHOWFILTER:
      return state.set('showFilter', Immutable.fromJS(action.payload));
    case TOGGLE_EVENT_MAP_LOCATE:
      return state.set('locateMe', !state.get('locateMe'));
    case GET_EVENT_IMAGES_REQUEST:
      return state.set('listState', 'loading');
    case GET_EVENT_IMAGES_SUCCESS:
      return state.set('listState', 'ready');
    case GET_EVENT_IMAGES_FAILURE:
      return state.set('listState', 'failed');
    case SET_EVENT_IMAGES:
      return state.set('images', Immutable.fromJS(action.payload));
    default:
      return state;
  }
}
