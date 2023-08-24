
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

function Auth() {
  return (
    <div className="Auth">
      <header className="Auth-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>    
      </header>
    </div>
  );
}

export default Auth;
