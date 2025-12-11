'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Reddit Login</h1>
      <p>This page will allow you to connect to Reddit and comment/vote on videos.</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: '#1a1a1a', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onClick={() => signIn('reddit')}
      >
        Login with Reddit
      </button>
    </div>
  );
}
