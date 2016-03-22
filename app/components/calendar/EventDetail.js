'use strict';

import React, {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  PropTypes,
  Platform,
  Linking
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

import analytics from '../../services/analytics';
import locationService from '../../services/location';
import time from '../../utils/time';

import theme from '../../style/theme';
import Toolbar from './EventDetailToolbar';
import EventListItem from './EventListItem';

const VIEW_NAME = 'EventDetail';

const styles = StyleSheet.create({
  mainWrapper: {
    position: 'relative',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },

  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  contenColumnScrollView: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.22,
    left: 20,
    right: 20,
    bottom: 0,
    flex: 1
  },


  // # Styles for the "content column"
  //
  contentColumnWrapper: {
    flex: 1,
    paddingBottom: 40
  },

  imageWrapper: {
    flex: 1,
    position: 'relative',
    height: 200,
  },
  imageElement: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
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

    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 5
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
    paddingRight: 20,
    marginBottom: 10
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

  descriptionTextWrapper: {
    marginTop: 5,
    marginBottom: 50,

    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  descriptionText: {
    flex: 1,
    color: '#aaa',
    backgroundColor: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'left',

    paddingTop: 10,
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 15
  }
});

export default React.createClass({
  propTypes: {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
  },

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

  renderContent(model) {
    const timepoint = time.formatEventTime(model.startTime, model.endTime, { formatLong: true });


    return <View style={styles.contentColumnWrapper}>
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

        <View style={styles.descriptionTextWrapper}>
          <Text style={styles.descriptionText}>{model.description}</Text>
        </View>

    </View>;
  },

  render() {
    let model = this.props.route.model;

    return (
      <View style={styles.mainWrapper}>
        {(Platform.OS === 'android') && <Toolbar title={model.name} navigator={this.props.navigator} />}

        <MapView style={styles.map}
          initialRegion={{
            latitude: model.location.latitude,
            longitude: model.location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          }}
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsIndoors={false}
          rotateEnabled={false}
        >
          <MapView.Marker
            image={require('../../../assets/marker.png')}
            coordinate={model.location} />
        </MapView>

        <ScrollView style={styles.contenColumnScrollView}>
          {this.renderContent(model)}
        </ScrollView>
      </View>
    );
  }
});

