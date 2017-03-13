import api from '../services/api';
import {createRequestActionTypes} from '.';
import { getCityId } from '../concepts/city';

const SET_FEED = 'SET_FEED';
const APPEND_FEED = 'APPEND_FEED';

const {
  GET_FEED_REQUEST,
  GET_FEED_SUCCESS,
  GET_FEED_FAILURE
} = createRequestActionTypes('GET_FEED');
const {
  REFRESH_FEED_REQUEST,
  REFRESH_FEED_SUCCESS,
  // Failure of refresh is also modeled as "success"
  // REFRESH_FEED_FAILURE
} = createRequestActionTypes('REFRESH_FEED');
const DELETE_FEED_ITEM = 'DELETE_FEED_ITEM';
const VOTE_FEED_ITEM = 'VOTE_FEED_ITEM';

const fetchFeed = () => (dispatch, getState) => {
  const cityId = getCityId(getState());

  if (!cityId) {
    return;
  }

  dispatch({ type: GET_FEED_REQUEST });
  return api.fetchModels('feed', cityId)
  .then(items => {
    dispatch({
      type: SET_FEED,
      feed: items
    });

    dispatch({ type: GET_FEED_SUCCESS });
  })
  .catch(error => dispatch({ type: GET_FEED_FAILURE, error: true, payload: error }));
};

const refreshFeed = () => (dispatch, getState) => {
  dispatch({ type: REFRESH_FEED_REQUEST });

  const cityId = getCityId(getState());
  return api.fetchModels('feed', cityId)
  .then(items => {
    dispatch({
      type: SET_FEED,
      feed: items
    });
    dispatch({ type: REFRESH_FEED_SUCCESS });
    dispatch({ type: GET_FEED_SUCCESS });
  })
  .catch(error => dispatch({ type: REFRESH_FEED_SUCCESS, error: true, payload: error }));
};

const loadMoreItems = (lastID) => (dispatch, getState) => {
  dispatch({ type: REFRESH_FEED_REQUEST });

  const cityId = getCityId(getState());
  return api.fetchMoreFeed(lastID, cityId)
  .then(items => {
    dispatch({
      type: APPEND_FEED,
      feed: items
    });
    dispatch({ type: REFRESH_FEED_SUCCESS });
    dispatch({ type: GET_FEED_SUCCESS });
  })
  .catch(error => dispatch({ type: REFRESH_FEED_SUCCESS }));
};

const removeFeedItem = (item) => {
  return dispatch => {
    api.deleteFeedItem(item)
      .then(() => dispatch({
        type: DELETE_FEED_ITEM,
        item
      }))
      .catch(error => console.log('Error when trying to delete feed item', error));
  };
};

const voteFeedItem = (item, value) => {
  const { id } = item;

  const vote = { value, feedItemId: id };

  return (dispatch) => {
    api.voteFeedItem(vote)
      .then(() => dispatch({
        type: VOTE_FEED_ITEM,
        vote
      }))
      .catch(error => console.log('Error when trying to vote feed item', error));
  };
}

// Open image in Lightbox
const OPEN_LIGHTBOX = 'OPEN_LIGHTBOX';
const CLOSE_LIGHTBOX = 'CLOSE_LIGHTBOX';
const openLightBox = (item) => {
  return { type: OPEN_LIGHTBOX, payload: { item } };
};

const closeLightBox = () => {
  return { type: CLOSE_LIGHTBOX };
};

export {
  SET_FEED,
  APPEND_FEED,
  GET_FEED_REQUEST,
  GET_FEED_SUCCESS,
  VOTE_FEED_ITEM,
  GET_FEED_FAILURE,
  REFRESH_FEED_REQUEST,
  REFRESH_FEED_SUCCESS,
  DELETE_FEED_ITEM,
  OPEN_LIGHTBOX,
  CLOSE_LIGHTBOX,

  fetchFeed,
  refreshFeed,
  loadMoreItems,
  removeFeedItem,
  voteFeedItem,
  openLightBox,
  closeLightBox
};
