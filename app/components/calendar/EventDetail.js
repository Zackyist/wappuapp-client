'use strict';

import React, {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  Platform,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import analytics from '../../services/analytics';
import locationService from '../../services/location';
import time from '../../utils/time';

import theme from '../../style/theme';
import Toolbar from './EventDetailToolbar';
import EventListItem from './EventListItem';

const VIEW_NAME = 'EventDetail';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: 20
  },
  content: {
    padding: 20,
    flex: 1
  },


  imageWrapper: {
    width: Dimensions.get('window').width,
    position: 'relative'
  },
  imageElement: {
    height: 200,
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,

    opacity: 0.92,
    backgroundColor: theme.secondary,
    color: '#FFF'
  },


  detailItemWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    backgroundColor: theme.gray,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },

    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 10
  },
  detailRowWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  detailItemIcon: {
    fontSize: 25,
    marginTop: 1,
    paddingRight: 10
  },
  detailItemText: {
    fontSize: 12,
    lineHeight: 12,
    alignSelf: 'center'
  },


  infoWrapper: {
    elevation: 2,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.primaryDarker,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  eventTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#CF3C89'
  },
  eventOrganizer: {
    textAlign: 'center',
    marginBottom: 10
  },
  eventTime: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.light
  },

  descriptionText: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'justify'
  }
});

export default React.createClass({
  componentDidMount() {
    // TODO - trigger what event is watched
    analytics.viewOpened(VIEW_NAME);
  },

  getEventStatus(timepoint) {
    if (timepoint.onGoing) {
      return 'Ongoing';
    } else if (timepoint.startsSoon) {
      return 'Starting soon';
    } else {
      return null;
    }
  },

  renderEventDetails(model, timepoint) {
    return (
      <View>

        {model.facebookId &&
          <TouchableOpacity
            style={styles.detailItemWrapper}
            onPress={() => Linking.openURL(`https://www.facebook.com/events/${ model.facebookId }`)}
          >
            <View style={styles.detailRowWrapper}>
              <Icon style={styles.detailItemIcon} name='social-facebook' size={20}/>
              <Text style={styles.detailItemText}>{model.attendingCount} attending </Text>
              <Icon style={styles.detailItemIcon} name='ios-arrow-forward' />
            </View>
          </TouchableOpacity>
        }

        <TouchableOpacity
          style={styles.detailItemWrapper}
          onPress={() => Linking.openURL(locationService.getGeoUrl(model))}
        >
          <View style={styles.detailRowWrapper}>
            <Icon name='location' style={styles.detailItemIcon} />
            <Text style={styles.detailItemText}>{model.locationName} </Text>
            <Icon style={styles.detailItemIcon} name='navigate' />
          </View>
        </TouchableOpacity>

      </View>
    );
  },

  render: function() {
    let model = this.props.route.model;
    const timepoint = time.formatEventTime(model.startTime, model.endTime, { formatLong: true });

    return <View style={styles.wrapper}>
      {(Platform.OS === 'android') && <Toolbar title={model.name} navigator={this.props.navigator} />}

      <ScrollView>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: model.coverImage }}
            style={styles.imageElement} />
          <Text style={styles.imageOverlayBadge}>{this.getEventStatus(timepoint)}</Text>
        </View>

        <View style={styles.infoWrapper}>
          <Text style={styles.eventTitle}>{model.name}</Text>
          <Text style={styles.eventOrganizer}>by {model.organizer}</Text>
          <Text style={styles.eventTime}>{timepoint.date} ({timepoint.time} - {timepoint.endTime})</Text>
        </View>

        {this.renderEventDetails(model, timepoint)}

        <View style={styles.content}>
          <Text style={styles.descriptionText}>{model.description}</Text>
        </View>

      </ScrollView>
    </View>;
  }
});
