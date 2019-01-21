import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import CreateWeensyPage from './scenes/CreateWeensyPage';
import LoginPage from './scenes/LoginPage';
import MyWeensysPage from './scenes/MyWeensysPage';

const MyWeensysPageStack = createStackNavigator({
  MyWeensysPage: MyWeensysPage
});

const CreateWeensyPageStack = createStackNavigator({
  CreateWeensyPage: CreateWeensyPage
});

const LoginPageStack = createStackNavigator({
  LoginPage: LoginPage
});


export default createAppContainer(createBottomTabNavigator(
  {
    CreateWeensyPage: CreateWeensyPageStack,
    MyWeensysPage: MyWeensysPageStack,
    LoginPage: LoginPageStack
  },
  {
    /* Other configuration remains unchanged */
  }
));