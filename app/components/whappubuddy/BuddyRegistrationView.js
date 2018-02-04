// TODO: Remove unused imports

'use strict';

import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Picker,
  Platform, 
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as keyboard from '../../utils/keyboard';

import {
  fetchUserProfile,
} from '../../concepts/user';
import {
  fetchBuddyProfile,
} from '../../concepts/buddyUser';
import {
  closeBuddyRegistrationView,
  openBuddyRegistrationView,
  putBuddyProfile,
  updateBuddyBio,
  updateBuddyClassYear,
  updateBuddyLookingFor
} from '../../actions/registration';

import theme from '../../style/theme';
import Header from '../common/Header';
import Button from '../../components/common/Button';
import Toolbar from '../registration/RegistrationToolbar';

const { height, width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class BuddyRegistrationView extends Component {
  componentDidMount() {
    const { userId } = this.props;
    this.props.fetchBuddyProfile(userId);
  }

  @autobind
  saveProfile() {
    this.props.putBuddyProfile(this.onSaveError);
  }

  @autobind
  onChangeBio(buddyBio) {
    this.props.updateBuddyBio(buddyBio);
  }

  @autobind
  onChangeClassYear(buddyClassYear) {
    const trimmedYear = buddyClassYear.trim();
    this.props.updateBuddyClassYear(trimmedYear);
  }

  @autobind
  onChangeLookingFor(buddyLookingFor, itemIndex)  {
    this.props.updateBuddyLookingFor(buddyLookingFor);
  }

  @autobind
  onRequestClose() {
    this.props.closeBuddyRegistrationView();
  }

  @autobind
  onSaveError() {
    Alert.alert(
      'Incomplete information',
      'Please fill in all the fields!',
      [
        { text: 'Close profile editor',
          onPress: () => this.onRequestClose(), style: 'cancel' },
        { text: 'Okay, let me fix that',
          onPress: () => { return }, style: 'default' }
      ]
    );
  }

  @autobind
  renderLookingForPickerItems() {
    var pickerItems = [];
    for (var i = 0; i < this.props.lookingForTypes.size; i++) {
      const itemLabel = this.props.lookingForTypes.get(i).type;
      const itemValue = this.props.lookingForTypes.get(i).id;
      pickerItems.push(<Picker.Item key={itemValue} label={itemLabel} value={itemValue}/>);
    }

    return pickerItems;
  }

  _renderBioSelect() {
    return (
      <View style={[styles.inputGroup, {marginTop: 10}]}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>{`Write a short bio (max. 250 characters)`}</Text>
        </View>
        <View style={styles.inputFieldWrap}>
          <TextInput
            ref={view => this.bioTextInputRef = view}
            autoCorrect={false}
            autoCapitalize={'sentences'}
            clearButtonMode={'while-editing'}
            maxLength={250}
            multiline={true}
            numberOfLines={5}
            textAlignVertical={'top'}
            returnKeyType={'done'}
            style={[styles.inputFieldMultiline, styles['inputField_' + Platform.OS]]}
            onChangeText={this.onChangeBio}
            onFocus={() => {
              keyboard.onInputFocus(this.containerScrollViewRef, this.bioTextInputRef,300);
            }}
            onBlur={() => {
              keyboard.onInputBlur(this.containerScrollViewRef)
            }}
            value={this.props.buddyBio}
          />
        </View>
      </View>
    );
  }

  _renderClassYearSelect() {
    return (
      <View style={[styles.inputGroup, {marginTop: 10}]}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>{`What's your current class year?`}</Text>
        </View>
        <View style={styles.inputFieldWrap}>
          <TextInput
            ref={view => this.yearTextInputRef = view}
            autoCorrect={false}
            autoCapitalize={'words'}
            clearButtonMode={'while-editing'}
            maxLength={2}
            textAlignVertical={'top'}
            returnKeyType={'done'}
            style={[styles.inputField, styles['inputField_' + Platform.OS]]}
            onChangeText={this.onChangeClassYear}
            onFocus={() => {
              keyboard.onInputFocus(this.containerScrollViewRef, this.yearTextInputRef,300);
            }}
            onBlur={() => {
              keyboard.onInputBlur(this.containerScrollViewRef)
            }}
            value={this.props.buddyClassYear}
          />
        </View>
      </View>
    );
  }

  _renderLookingForSelect() {
    return (
      <View style={[styles.inputGroup, {marginTop: 10}]}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>{`What kind of Wappu company are you looking for?`}</Text>
        </View>
        <View style={styles.inputFieldWrap}>
          <Picker
            selectedValue={this.props.buddyLookingFor || 1}
            onValueChange={this.onChangeLookingFor}
            mode="dropdown"
          >
            {this.renderLookingForPickerItems()}
          </Picker>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Modal
        visible={this.props.isBuddyRegistrationViewOpen}
        animationType={'slide'}
        onRequestClose={this.onRequestClose}
      >
        <Toolbar icon={'done'}
          iconClick={this.onRequestClose}
          title='Fill your WhappuBuddy profile' />

        <ScrollView
          ref={view => this.containerScrollViewRef = view}
          showsVerticalScrollIndicator={true}
          style={styles.container}>
          <View style={[styles.innerContainer]}>
            {this._renderBioSelect()}
            {this._renderLookingForSelect()}
            {this._renderClassYearSelect()}
          </View>
        </ScrollView>
          
        <View style={styles.bottomButtonContainer}>
          <Button
            onPress={this.saveProfile}
            style={styles.saveButton}
            isDisabled={false}
          >
            Save
          </Button>
        </View>
      </Modal>
    );
  }
};



const styles = StyleSheet.create({
  backLink: {
    position: 'absolute',
    left: 7,
    top: 7,
    zIndex: 2,
  },
  backLinkText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.transparent
  },
  backLinkIcon: {
    color: theme.white
  },
  bottomButtonContainer:{
    flex:1,
    flexDirection:'row',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height:50,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  button: {
    height: 35,
    borderRadius: 2,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
    paddingBottom: 50,
  },
  header: {
    flex:1,
    elevation: 3,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  innerContainer: {
    flex:1,
    paddingTop:15,
    paddingBottom: 50,
    margin: 0,
    borderRadius: 5
  },
  inputField: {
    height: 40,
    fontSize:16,
  },
  inputField_android: {

  },
  inputField_ios: {
    padding:5,
    backgroundColor: 'rgba(20,20,20,0.05)',
  },
  inputFieldMultiline:{
    fontSize:16,
    height:200,
  },
  inputFieldWrap:{
    paddingTop: 5,
    padding:15,
  },
  inputGroup:{
    padding: 0,
    backgroundColor:theme.light,
    marginHorizontal:15,
    marginBottom:15,
    elevation:1,
    flex:1,
    borderRadius:5,
    overflow:'hidden'
  },
  inputLabel:{
    padding: 15,
    paddingTop: 13,
    paddingBottom: 10,
    borderBottomWidth: 0,
    borderColor: '#ddd'
  },
  inputLabelText:{
    fontSize:16,
    color:theme.secondary,
    fontWeight:'bold',
    textAlign: IOS ? 'center' : 'left',
  },
  item: {
    flex: 1
  },
  saveButton: {
    borderRadius:0,
    flex:1,
    marginLeft:0,
  }
});


const mapDispatchToProps = {
    closeBuddyRegistrationView,
    openBuddyRegistrationView,
    fetchUserProfile,
    fetchBuddyProfile,
    putBuddyProfile,
    updateBuddyBio,
    updateBuddyClassYear,
    updateBuddyLookingFor
};

const select = store => {
  return {
    buddyBio: store.registration.get('bio_text'),
    buddyLookingFor: store.registration.get('bio_looking_for_type_id'),
    buddyClassYear: store.registration.get('class_year'),
    isBuddyRegistrationViewOpen: store.registration.get('isBuddyRegistrationViewOpen'),
    lookingForTypes: store.registration.get('lookingForTypes'),
    userId: store.registration.get('userId'),
    userName: store.registration.get('name')
  };
};

export default connect(select, mapDispatchToProps)(BuddyRegistrationView);