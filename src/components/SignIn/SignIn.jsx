import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import astronaut from '../../img/misc/astronaut.svg';
import './SignIn.css';

const SignIn = ({ handleSignIn, signInError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid =
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g.test(email) &&
    password.length > 6;

  return (
    <div className='sign-in-container'>
      <div className='sign-in'>
        <h1 className='ink'>Ink</h1>
        <form>
          <div className='sign-in-method'>
            <input
              className='username'
              type='email'
              aria-label='Email'
              placeholder='Email'
              autoCorrect='off'
              aria-required='true'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              aria-label='Password'
              placeholder='Password'
              autoCorrect='off'
              aria-required='true'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={isFormValid ? 'log-in-btn active' : 'log-in-btn'}
              type='submit'
              disabled={!isFormValid}
              onClick={() => handleSignIn(email, password)}
            >
              Log In
            </button>
            <div className='or'>
              <div className='or-line' />
              <p>OR</p>
              <div className='or-line' />
            </div>
            <button
              className='guest-btn'
              type='button'
              onClick={() => handleSignIn('Guest')}
            >
              <img src={astronaut} alt='' />
              Log In as Guest
            </button>
          </div>
          <p className='sign-in-error' role='alert'>
            {signInError}
          </p>
          <a href='/' className='reset-password'>
            Forgot password?
          </a>
        </form>
      </div>

      <div className='create-account'>
        <p>
          Don&#39;t have an account?
          <Link to='/register'> Sign up</Link>
        </p>
      </div>
    </div>
  );
};

SignIn.defaultProps = {
  signInError: '',
};

SignIn.propTypes = {
  handleSignIn: PropTypes.func.isRequired,
  signInError: PropTypes.string,
};

export default SignIn;
