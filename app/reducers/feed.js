'use strict';
import Immutable from 'immutable';

import {
  SET_FEED,
  APPEND_FEED,
  GET_FEED_REQUEST,
  GET_FEED_SUCCESS,
  GET_FEED_FAILURE,
  REFRESH_FEED_REQUEST,
  REFRESH_FEED_SUCCESS,
  DELETE_FEED_ITEM,
  OPEN_LIGHTBOX,
  VOTE_FEED_ITEM,
  CLOSE_LIGHTBOX
} from '../actions/feed';
import LoadingStates from '../constants/LoadingStates';

const initialState = Immutable.fromJS({
  list: [],
  listState: LoadingStates.NONE,
  isRefreshing: false,
  lightBoxItem: {},
  isLightBoxOpen: false
});

export default function feed(state = initialState, action) {
  switch (action.type) {
    case SET_FEED:
      return state.set('list', Immutable.fromJS(action.feed));
    case APPEND_FEED:
      return (action.feed && action.feed.length) ?
        state.set('list', Immutable.fromJS(state.get('list')
          .concat(Immutable.fromJS(action.feed)))) :
        state;
    case GET_FEED_REQUEST:
      return state.set('listState', LoadingStates.LOADING);
    case GET_FEED_SUCCESS:
      return state.set('listState', LoadingStates.READY);
    case GET_FEED_FAILURE:
      return state.set('listState', LoadingStates.FAILED);
    case REFRESH_FEED_REQUEST:
      return state.set('isRefreshing', true);
    case REFRESH_FEED_SUCCESS:
      return state.set('isRefreshing', false);
    case DELETE_FEED_ITEM:
      const originalList = state.get('list');
      const itemIndex = originalList.findIndex((item) => item.get('id') === action.item.id);

      if (itemIndex < 0) {
        console.log('Tried to delete item, but it was not found from state:', itemIndex);
        return state;
      } else {
        return state.set('list', originalList.delete(itemIndex));
      }

    case VOTE_FEED_ITEM:
      const list = state.get('list');
      const itemIndex_ = list.findIndex((item) => item.get('id') === action.feedItemId);
      if (itemIndex < 0) {
        console.log('Tried to vote item, but it was not found from state:', itemIndex);
        return state;
      } else {
        return state.updateIn(['list', itemIndex_, 'difference'], value => action.difference);
      }


    case OPEN_LIGHTBOX:
      return state.merge({
        isLightBoxOpen: true,
        lightBoxItem: Immutable.fromJS(action.payload.item)
      });

    case CLOSE_LIGHTBOX:
      return state.merge({
        isLightBoxOpen: false,
        lightBoxItem: Immutable.fromJS({}),
      })

    default:
      return state;
  }
}
