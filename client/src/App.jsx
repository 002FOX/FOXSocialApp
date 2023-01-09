import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Navbar from './components/Navbar.jsx';
import { useSelector } from 'react-redux';

const App = () => {
  const mode = useSelector((state) => state.mode);
  const isAuth = Boolean(useSelector((state) => state.token));

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Navbar />}>
        <Route index element={<HomePage />}/>
        <Route path="login" element={<LoginPage />} />
        <Route path='signup' element={<SignupPage />} />
        <Route path='user/:userId' element={isAuth? <ProfilePage/> : <Navigate to="/"/>} />
      </Route>
    )
  );

  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App