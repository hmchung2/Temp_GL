import {gql, useMutation} from '@apollo/client';
import React, {MutableRefObject, useEffect, useRef} from 'react';
import {Text, View} from 'react-native';
import AuthLayout from '../components/auth/AuthLayout';
import {TextInput} from '../components/auth/AuthShared';
import {useForm} from 'react-hook-form';
import AuthButton from '../components/auth/AuthButton';
import {logUserIn} from '../apollo';
import {RootStackParamList} from '../shared/shared.types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type LoginNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'StackLogin'
>;

interface LoginFormData {
  username: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

const Login = ({route}: LoginNavigationProps) => {
  const passwordRef: MutableRefObject<null> = useRef(null);

  const {register, handleSubmit, setValue, watch} = useForm<LoginFormData>({
    defaultValues: {
      username: route.params?.username,
      password: route.params?.password,
    },
  });

  const onCompleted = async (data: any) => {
    const {
      login: {ok, token, error},
    } = data;
    console.log('ok : ', ok);
    console.log('token : ', token);
    console.log('error : ', error);
    if (ok) {
      await logUserIn(token);
    }
  };

  const onValid = (data: any) => {
    if (!loading) {
      logInMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  const [logInMutation, {loading, error}] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });

  const onNext = (nextOne: any) => {
    nextOne?.current?.focus();
  };

  useEffect(() => {
    register('username', {
      required: true,
    });
    register('password', {
      required: true,
    });
  }, [register]);

  return (
    <AuthLayout logoMarginTop={150}>
      <TextInput
        value={watch('username')}
        placeholder="Username"
        returnKeyType="next"
        autoCapitalize="none"
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={text => setValue('username', text)}
      />
      <TextInput
        value={watch('password')}
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={text => setValue('password', text)}
      />
      <AuthButton
        text="Log In!!"
        loading={loading}
        disabled={!watch('username') || !watch('password')}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
};

export default Login;
