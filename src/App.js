import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import CreateWeensyPage from './scenes/CreateWeensyPage';
import LoginPage from './scenes/LoginPage';
import MyWeensysPage from './scenes/MyWeensysPage';
import EditVideoPage from './scenes/EditVideoPage';
import NavigationService from './NavigationService';
import ShareVideoPage from './scenes/ShareVideoPage';
import Icon from 'react-native-vector-icons/FontAwesome';


const MyWeensysPageStack = createStackNavigator({ 
  'MyWeensysPage': {
    screen: MyWeensysPage
  },
  'EditVideoPage' : {
    screen: EditVideoPage
  },
  'ShareVideoPage' : {
    screen: ShareVideoPage
  }
});

MyWeensysPageStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === 'EditVideoPage' || routeName === 'ShareVideoPage') {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const CreateWeensyPageStack = createStackNavigator({ CreateWeensyPage: CreateWeensyPage });
const LoginPageStack = createStackNavigator({ LoginPage: LoginPage });
const ICON_SIZE = 22;

const AppContainer = createAppContainer(createBottomTabNavigator(
  {
    CreateWeensyPage: {
      screen: CreateWeensyPageStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="tv" size={ICON_SIZE}/>
        )
      }
    },
    MyWeensysPage: {
      screen: MyWeensysPageStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="archive" size={ICON_SIZE}/>
        )
      }
    },
    LoginPage: {
      screen: LoginPageStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="bookmark" size={ICON_SIZE}/>
        )
      }
    }
  },
  {
    tabBarOptions: {
      showLabel: false
    }
  }
));

export default class App extends React.Component {
  render() {
    return (
      <AppContainer
        ref={nav => {
          this.navigator = nav;
          NavigationService.setTopLevelNavigator(nav);
        }}
      />
    );
  }
}