import React, { useState, useEffect, useReducer, useContext } from 'react';
import AuthContext from '../../context/auth-context';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../Input/Input.jsx';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'USER_EMAIL_INPUT':
      return {
        ...state,
        emailValue: action.emailValue,
        emailIsValid: action.emailValue.includes('@'),
      };
    case 'USER_PW_INPUT':
      return {
        ...state,
        passwordValue: action.passwordValue,
        passwordIsValid: action.passwordValue.trim().length > 6,
      };
    case 'INPUT_EMAIL_BLUR':
      return { ...state, emailIsValid: state.emailValue.includes('@') };
    case 'INPUT_PW_BLUR':
      return {
        ...state,
        passwordIsValid: state.passwordValue.trim().length > 6,
      };
    default:
      return {
        passwordValue: '',
        passwordIsValid: false,
        emailValue: '',
        emailIsValid: false,
      };
  }
};

const Login = (props) => {
  const authCtx = useContext(AuthContext);

  const [inputState, dispatchInput] = useReducer(inputReducer, {
    emailValue: '',
    emailIsValid: false,
    passwordValue: '',
    passwordIsValid: false,
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const { emailIsValid, passwordIsValid, emailValue, passwordValue } =
    inputState;

  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchInput({ type: 'USER_EMAIL_INPUT', emailValue: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchInput({ type: 'USER_PW_INPUT', passwordValue: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchInput({ type: 'INPUT_EMAIL_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchInput({ type: 'INPUT_PW_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailValue, passwordValue);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          value={emailValue}
          type="email"
          label="E-mail"
          isValid={emailIsValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          id="password"
          value={passwordValue}
          type="password"
          label="Password"
          isValid={passwordIsValid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
