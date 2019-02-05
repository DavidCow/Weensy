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


const MyWeensysPageStack = createStackNavigator({ 
  'MyWeensysPage': MyWeensysPage,
  'EditVideoPage' : {
    screen: EditVideoPage,
    navigationOptions: {
      title: 'Edit Video Page',
    }
  },
  'ShareVideoPage' : {
    screen: ShareVideoPage,
    navigationOptions: {
      title: 'Share Video'
    }
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

const AppContainer = createAppContainer(createBottomTabNavigator(
  {
    CreateWeensyPage: CreateWeensyPageStack,
    MyWeensysPage: MyWeensysPageStack,
    LoginPage: LoginPageStack
  },
  {
    // Other configuration remains unchanged 
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