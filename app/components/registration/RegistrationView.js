'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import autobind from 'autobind-decorator';
import AppIntro from 'react-native-app-intro';

import theme from '../../style/theme';
import Button from '../../components/common/Button';
import IntroView from './IntroView';
import Modal from 'react-native-modalbox';
import Team from './Team';
import Toolbar from './RegistrationToolbar';
import {
  putUser,
  updateName,
  selectTeam,
  generateName,
  dismissIntroduction,
  closeRegistrationView
} from '../../actions/registration';
import { showChooseTeam } from '../../actions/team';
import * as keyboard from '../../utils/keyboard';
import Icon from 'react-native-vector-icons/MaterialIcons';


const IOS = Platform.OS === 'ios';
const {height} = Dimensions.get('window');

class RegistrationView extends Component {
  propTypes: {
    name: PropTypes.string.isRequired,
    //teams: PropTypes.instanceOf(Immutable.List).isRequired,
    teams: PropTypes.any,
    selectedTeam: PropTypes.number.isRequired,
    isRegistrationViewOpen: PropTypes.bool.isRequired,
    isRegistrationInfoValid: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      showSkipButton: false,
      selectedCity: 1,
      index: 0
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.isRegistrationViewOpen) {
        this.onClose()
        return true;
      }
      return false;
    })
  }

  @autobind
  onRegister() {
    this.props.putUser(this.state.selectedCity);
  }

  @autobind
  onChangeName(name) {
    this.props.updateName(name);
  }

  @autobind
  onSelectTeam(id) {
    this.props.selectTeam(id);
  }

  @autobind
  onSelectCity(id) {
    this.setState({
      selectedCity: id
    });
  }

  @autobind
  onGenerateName() {
    this.props.generateName();
  }

  @autobind
  onShowChooseTeam() {
    this.props.showChooseTeam();
  }

  @autobind
  onDismissIntroduction() {
    if (this.props.isRegistrationInfoValid) {
      this.onRegister();
    }
    this.props.dismissIntroduction();
  }

  @autobind
  onClose() {
    if (this.props.isRegistrationInfoValid) {
      this.onRegister();
    }
    this.props.closeRegistrationView();
  }

  teamIsValid() {
    const { selectedTeam, teams } = this.props
    const { selectedCity } = this.state;
    const team = teams.find(team => team.get('id') === selectedTeam);

    if (team) {
      return team.get('cityId') === selectedCity;
    }
    return false;
  }

  changeSlide(index) {
    this.setState({
      showSkipButton: index > 1,
      index
    });
  }

  _renderNameSelectContainer() {
    const simplified = this.props.initialSetup;
    const containerStyles = [styles.container, styles.modalBackgroundStyle, simplified && styles.simplified]

    return (
      <View style={containerStyles}>

        {!simplified ? <Toolbar icon={this.props.isRegistrationInfoValid ? 'done' : 'close'}
          iconClick={this.onClose}
          title='Fill your profile' />
        : <Text style={styles.header}>Create a user</Text>}

        <ScrollView ref={view => this.containerScrollViewRef = view} style={{flex:1}}>
          <View style={[styles.innerContainer]}>
            {!simplified && this._renderCitySelect()}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Text style={simplified ? styles.subLabel : styles.inputLabelText}>Choose your Guild</Text>
              </View>

              <View style={styles.inputFieldWrap}>
                <ScrollView style={{flex:1, height: (IOS || height > 605) ? 210 : null}}>
                  {this.props.teams.map(team => {
                    if (team.get('cityId') === this.state.selectedCity) {
                      return <Team
                        key={team.get('id')}
                        name={team.get('name')}
                        teamid={team.get('id')}
                        logo={team.get('imagePath')}
                        selected={this.props.selectedTeam}
                        onPress={this.onSelectTeam.bind(this, team.get('id'))}/>;
                    }}
                  )}
                </ScrollView>
              </View>
            </View>
            {this._renderNameSelect()}
          </View>
        </ScrollView>

        {!simplified && <View style={styles.bottomButtons}>
          <Button
            onPress={this.onRegister}
            style={styles.modalButton}
            isDisabled={!this.props.isRegistrationInfoValid || !this.teamIsValid()}>
            Save
          </Button>
        </View>}
      </View>
    );
  }

  _renderCitySelect() {
    return (
      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>{`Choose your City`}</Text>
        </View>
        <View style={{flexDirection: 'row', padding: 10}}>
          {this.props.cities.map((city, i) =>
            <View key={i} style={styles.item}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: this.state.selectedCity === city.get('id') ? '#50E3C2' : 'white'}]}
                onPress={this.onSelectCity.bind(this, city.get('id'))}>
                <Text style={[styles.text, {color: this.state.selectedCity  === city.get('id')? 'white' : '#666'}]}>
                  {city.get('name')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  _renderNameSelect() {
    const simplified = this.props.initialSetup;

    return (
      <View style={[styles.inputGroup, {marginBottom:4}]}>
        <View style={styles.inputLabel}>
          <Text style={simplified ? styles.subLabel : styles.inputLabelText}>{`Hi there! What's your wappu name?`}</Text>
        </View>
        <View style={styles.inputFieldWrap}>
          <TextInput
            ref={view => this.nameTextInputRef = view}
            autoCorrect={false}
            autoCapitalize={'words'}
            clearButtonMode={'while-editing'}
            returnKeyType={'done'}
            style={[styles.inputField, styles['inputField_' + Platform.OS]]}
            onChangeText={this.onChangeName}
            onFocus={() => {
              keyboard.onInputFocus(this.containerScrollViewRef, this.nameTextInputRef,300);
            }}
            onBlur={() => {
              keyboard.onInputBlur(this.containerScrollViewRef)
            }}
            value={this.props.name}
          />
        </View>

        <View>
          <TouchableOpacity onPress={this.onGenerateName}>
            <View style={styles.textButton}>
              <Icon name='loop' style={styles.textButtonIcon} />
              <Text style={styles.textButtonText}>Generate wappu name</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderIntroForCitySelection() {

    return (
      <Modal
        isOpen={this.props.isRegistrationViewOpen}
        swipeToClose={false}
        backdropPressToClose={false}>
        <AppIntro
          onSkipBtnClick={() => this.onClose()}
          onDoneBtnClick={() => this.onRegister()}
          showSkipButton={this.state.showSkipButton}
          showDoneButton={this.props.isRegistrationViewOpen && this.teamIsValid()}
          nextBtnLabel={this.state.index === 2 ? <Text style={{fontSize: 22}}>Join</Text> : '›'}
          onSlideChange={(index) => this.changeSlide(index)}
          defaultIndex={this.state.index}
          rightTextColor={theme.secondary}
          leftTextColor={theme.secondary}
          activeDotColor={theme.secondaryDark}
          dotColor={theme.secondary}>
          <View style={[styles.slide, { backgroundColor: '#fff' }]}>
            <IntroView simplified={true} onDismiss={this.onDismissIntroduction} closeRegistrationView={this.onClose} />
          </View>
          <View style={[styles.slide, { backgroundColor: '#fff' }]}>
            <IntroView simplified={true} onDismiss={this.onDismissIntroduction} closeRegistrationView={this.onClose} />
          </View>
          <View style={[styles.slide, { backgroundColor: '#fff' }]}>
            {this._renderNameSelectContainer()}
          </View>
        </AppIntro>
      </Modal>
    );
  }

  render() {
    return (
      this.props.initialSetup ?
        this._renderIntroForCitySelection()
        :
        <Modal
          isOpen={this.props.isRegistrationViewOpen}
          swipeToClose={false}
          backdropPressToClose={false}>
          {
            this.props.selectedTeam || this.props.isIntroductionDismissed
              ? this._renderNameSelectContainer()
              : <IntroView simplified={false} onDismiss={this.onDismissIntroduction} closeRegistrationView={this.onClose} />
          }
        </Modal>
    );
  }

}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:50
  },
  simplified: {
    marginBottom: 70,
    // marginTop: 30,
    alignSelf: 'stretch',
    backgroundColor: 'white'
  },
  innerContainer: {
    flex:1,
    paddingTop:IOS ? 15 : 10,
  },
  bottomButtons:{
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
  modalButton: {
    borderRadius:0,
    flex:1,
    marginLeft:0,
  },
  modalBackgroundStyle: {
    backgroundColor: '#eee'
  },
  inputGroup:{
    padding:0,
    backgroundColor:'#FFF',
    margin:10,
    marginTop:0,
    borderRadius:2,
    elevation:1,
    flex:1,
  },
  item: {
    flex: 1
  },
  button: {
    height: 40,
    borderRadius: 2,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputLabel:{
    padding:15,
    paddingTop:13,
    paddingBottom:13,
    borderBottomWidth:1,
    borderColor:'#ddd',
  },
  inputLabelText:{
    fontSize:14,
    color:theme.primary,
    fontWeight:'bold',
    textAlign: IOS ? 'center' : 'left',
  },
  subLabel: {
    color: theme.secondary,
    fontWeight: 'bold',
    fontSize: 18
  },
  inputFieldWrap:{
    padding:15,
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
  textButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: IOS ? 'center' : 'flex-start',
    padding: IOS ? 5 : 5,
    paddingLeft:20,
    paddingRight:20,
    marginBottom:15,
  },
  textButtonIcon: {
    color: theme.secondary,
    fontSize:18,
    paddingRight:5
  },
  textButtonText:{
    color: theme.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    fontWeight: 'bold',
    color: theme.secondary,
    marginTop: 30,
    marginLeft: IOS ? 25 : 15,
    fontSize: 28
  },
  introductionContainer: {
    margin: 10,
    marginTop: 20
  },
  introductionSecondaryText: {
    marginTop: 10,
    color: '#555'
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 0,
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const mapDispatchToProps = {
  putUser,
  updateName,
  selectTeam,
  generateName,
  dismissIntroduction,
  closeRegistrationView,
  showChooseTeam
};

const select = store => {

  const initialSetup =  store.city.get('id') === 1 || !store.city.get('id');
  return {
    isIntroductionDismissed: store.registration.get('isIntroductionDismissed'),
    isRegistrationViewOpen: store.registration.get('isRegistrationViewOpen'),
    name: store.registration.get('name'),
    selectedTeam: store.registration.get('selectedTeam'),
    selectedCity: store.city.get('id'),
    teams: store.team.get('teams'),
    cities: store.city.get('list'),
    isChooseTeamViewOpen: store.team.get('isChooseTeamViewOpen'),
    isRegistrationInfoValid: !!store.registration.get('name') &&
      !!store.registration.get('selectedTeam'),
    initialSetup
  };
};

export default connect(select, mapDispatchToProps)(RegistrationView);
