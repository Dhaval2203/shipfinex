import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

import ProtectedRoute from './auth/ProtectedRoute';
import Login from './auth/Login';
import SignUp from './auth/Signup';
import ErrorBoundary from './component/ErrorBoundary';
import Dashboard from './page/Dashboard';
import './App.css';

function getLibrary(provider) {
  return new Web3(provider)
}

function App() {
  return (
    <div className='App'>
      <ErrorBoundary>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Router>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />

              <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </Router>
        </Web3ReactProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
