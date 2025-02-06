import './App.css';
import { Button, NavButton } from './components/button/button';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';

import Home from "./routes/home/home"
import NotFound from './routes/notFound/notFound';
import Settings from './routes/settings/settings';
import { AuthenticationGuard } from './components/auth-guard';
import { useNavigate } from 'react-router-dom';

import { Routes, Route, Outlet } from "react-router-dom";
import { FaCog, FaCalendar, FaUser} from "react-icons/fa";
import { CallbackPage } from './routes/callback/callback';
import { ProfilePage } from './routes/profile/profile';
import CalenderPage from './routes/calender/calender';

import { NavBarButtons } from './components/authButtons/nav-bar-buttons';

import {NotificationContainer} from 'react-notifications';

import { useEffect } from 'react';
import {addAccessTokenInterceptor} from './utils/axios/axios'
import Loader from './components/loader/loader';
import Request from './routes/request/request';
import CreateRequest from './routes/request/createRequest';
import { getUserRoles, PERMISSION } from './utils/auth0/utils';
import Conversation from './routes/conversation/conversation';
// Add this line where you want to show the notification

function App() {

  let {isAuthenticated, getAccessTokenSilently} = useAuth0();

  useEffect(() => {
    if(isAuthenticated) {
      addAccessTokenInterceptor(getAccessTokenSilently);
    }

  }, [isAuthenticated, getAccessTokenSilently])

  // if(isLoading) return <Loader />

  return (
    <div className="container">
      {/* <Nav /> */}
      <div className="content">
        <div className="h-full flex justify-evenly mb-2 flex-wrap ">
        <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              {/* <Route path="settings" element={<Settings />} /> */}
              <Route path="request" element={<CreateRequest />} />
              <Route path="request/:id" element={<Request />} />

              <Route path="callback" element={<CallbackPage />} />

              <Route
                path="/profile"
                element={<AuthenticationGuard component={ProfilePage} />}
              />

              <Route
                path="/calender"
                element={<AuthenticationGuard component={CalenderPage} />}
              />

              <Route
                path="/conversation/:id"
                element={<AuthenticationGuard component={Conversation} />}
              />

              {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>

        </div>
      </div>
    </div>
  );
}

function Layout() {
  let {isAuthenticated, getAccessTokenSilently, isLoading} = useAuth0()
  let navigate = useNavigate();
  let [isSubscriber, setIsSubscriber] = useState(null);

  
  useEffect(() => {

    (async() => {
      let permissions = await getUserRoles(getAccessTokenSilently);
      if(!permissions) return
      let sub = permissions.includes(PERMISSION.SUBSCRIBER);
      console.log(sub)
      setIsSubscriber(sub)
    })().catch(e => {})
    
  }, [isAuthenticated])
  
  return (
    <div className='w-full h-full'>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav className='py-4 h-15 flex bg-d2 justify-between'>
        <img className="logo" src="/tempusCrop.png" alt="Booker logo" onClick={() => {
          navigate("/")
        }}/>
        {/* <p className=' w-1/3 text-l2 text-3xl flex items-center justify-center'>Booker</p>   */}
        <ul className='w-2/3 flex flex-wrap flex-row justify-end'>
            {isAuthenticated && (
              <>
                <SubscriberOnly isSubscriber={isSubscriber}>
                  <li className='flex items-center'>
                    <NavButton icon={<FaUser />} text="Profile" path='/profile'/>
                  </li>
                </SubscriberOnly>
              <li className='flex items-center'>
                <NavButton icon={<FaCalendar />} text="Calender" path='/calender'/>
              </li>
            </>
            )}
            {/* <SubscriberOnly isSubscriber={isSubscriber}>
              <li className='flex items-center'>
                <NavButton icon={<FaCog />} text="Settings" path='/settings'/>
              </li>
            </SubscriberOnly> */}
            <li className='flex items-center mr-4'>
              <NavBarButtons />
            </li>
        </ul>
      </nav>


      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
        <div className='mainContainer bg-l2' >

          <NotificationContainer style={{zIndex: 50}}/>
          {isLoading && <Loader />}
          {!isLoading && <Outlet />}
        </div>
    </div>
  );
}

let SubscriberOnly = ({isSubscriber, children}) => {
  
  if(!isSubscriber) {
    return <></>
  } else return <>{children}</>
}



export default App;
