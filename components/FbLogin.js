import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

import SocialButton from './SocialButton';
import FormInput from './FormInput';
import FormButton from './FormButton';

const FbLogin = () => {
  const [userInfo, setUserInfo] = useState({});

  const logoutWithFacebook = () => {
    LoginManager.logOut();
    setUserInfo({});
  };

  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name,email,picture',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          setUserInfo(user);
          console.log('result:', user);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  };



  const isLogin = userInfo.name;
  const buttonText = isLogin
    ? 'Sign Out from Facebook'
    : 'Sign In with Facebook';
  const onPressButton = isLogin ? logoutWithFacebook : loginWithFacebook;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLogin ? null : (
        <View>
          <Image
            source={require('../assets/chat-logo.png')}
            style={styles.logo}
          />

          <FormInput
            // labelValue={email}
            // onChangeText={(userEmail) => setEmail(userEmail)}
            placeholderText="Email"
            iconType="user"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            // labelValue={password}
            // onChangeText={(userPassword) => setPassword(userPassword)}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
          />
          <FormButton buttonTitle="Sign In" onPress={() => {}} />

          <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
            <Text style={styles.navButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      )}

      {Platform.OS === 'android' ? (
        <View>
          <SocialButton
            buttonTitle={buttonText}
            btnType="facebook"
            color="#4867aa"
            backgroundColor="#e6eaf4"
            onPress={onPressButton}
          />
        </View>
      ) : null}

      {isLogin ? null : (
        <View>
          <SocialButton
            buttonTitle="Sign In with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            // onPress={() => googleLogin()}
          />

          <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
            <Text style={styles.navButtonText}>
              Don't have an acount? Create here
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {userInfo.name && (
        <View style={styles.container}>
          <Text style={{fontSize: 16, marginVertical: 16}}>
            Logged in As <Text style={styles.userName}>{userInfo.name} </Text>
          </Text>
          <Image
            style={styles.userImg}
            source={{uri: userInfo.picture.data.url}}
          />
          <View style={styles.userInfoWrapper}>
            <Text>ID: {userInfo.id}</Text>
            <Text>First Name: {userInfo.first_name}</Text>
            <Text>Last Name: {userInfo.last_name}</Text>
            <Text>Email: {userInfo.email}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default FbLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  forgotButton: {
    marginVertical: 35,
  },

  userInfoWrapper: {
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
});
