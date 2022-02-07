import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header/Header';
import Home from './components/Home';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat';
import AddPost from './components/AddPost/AddPost';
import HorizontalPost from './components/Post/HorizontalPost/HorizontalPost';
import LikedFeed from './components/LikedFeed/LikedFeed';
import UserContext from './Context/UserContext';
import ThemeContext from './Context/ThemeContext';
import Settings from './components/Settings/Settings';
import FollowRequests from './components/FollowRequests/FollowRequests';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import { fetchUserData } from './firebase';
import './App.css';

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  const fallbackTheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? 'dark'
    : 'light';
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || fallbackTheme
  );

  const [user, setUser] = useState();

  const [loading, setLoading] = useState(
    JSON.parse(localStorage.getItem('userWillSignIn')) || false
  );

  const [showAddModal, setShowAddModal] = useState(false);

  const updateLoading = (value) => setLoading(value);
  const updateAddModal = (value) => setShowAddModal(value);

  const signInGuest = () => {
    // Sign In Guest -> account named @Guest
  };

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.displayName).then((res) => {
          setUser(res);
        });
        if (!localStorage.getItem('userWillSignIn'))
          localStorage.setItem('userWillSignIn', 'true');
        setLoading(false);
      } else {
        setUser();
        localStorage.removeItem('userWillSignIn');
      }
      return () => unsub;
    });
  }, []);

  useEffect(() => {
    document.querySelector('html').style.backgroundColor =
      theme === 'dark' ? 'rgb(34, 34, 34)' : 'rgb(250, 250, 250)';
  }, [theme]);

  return (
    <div className='App' data-theme={theme}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <UserContext.Provider value={{ user, setUser }}>
          {user && (
            <Header
              updateAddModal={updateAddModal}
              showAddModal={showAddModal}
            />
          )}
          {showAddModal && <AddPost updateAddModal={updateAddModal} />}
          <Switch location={background || location}>
            <Route exact path='/settings/follow-requests'>
              {user || localStorage.getItem('userWillSignIn') ? (
                <FollowRequests />
              ) : (
                <Redirect to='/' />
              )}
            </Route>
            <Route path='/:username/liked'>
              {user || localStorage.getItem('userWillSignIn') ? (
                <LikedFeed />
              ) : (
                <Redirect to='/' />
              )}
            </Route>
            <Route exact path='/:username/:postId'>
              {user || localStorage.getItem('userWillSignIn') ? (
                <HorizontalPost />
              ) : (
                <Redirect to='/' />
              )}
            </Route>
            <Route
              exact
              path='/reset-password'
              render={() => <ForgotPassword />}
            />
            <Route
              exact
              path='/'
              render={() => (
                <Home
                  updateLoading={updateLoading}
                  loading={loading}
                  signInGuest={signInGuest}
                />
              )}
            />
            <Route
              exact
              path='/register'
              render={() => (
                <Register
                  updateLoading={updateLoading}
                  signInGuest={signInGuest}
                />
              )}
            />
            <Route exact path='/settings'>
              {user || localStorage.getItem('userWillSignIn') ? (
                <Settings />
              ) : (
                <Redirect to='/' />
              )}
            </Route>
            <Route exact path='/chat'>
              {user || localStorage.getItem('userWillSignIn') ? (
                <Chat />
              ) : (
                <Redirect to='/' />
              )}
            </Route>
            <Route path='/:username'>
              {user || localStorage.getItem('userWillSignIn') ? (
                <Profile />
              ) : (
                <Redirect to='/' />
              )}
            </Route>
          </Switch>
          {background && (
            <Route path='/:username/:postId'>
              <HorizontalPost modal />
            </Route>
          )}
        </UserContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
