import React, { useState } from 'react';

interface Props {
  onLogin: (email: string, pass: string) => void;
  onCreateAccount: (email: string, pass: string) => void;
  error?: string | null;
}

export const LoginPage: React.FC<Props> = ({ onLogin, onCreateAccount, error }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <div className="p-6">
      <h2>{isSignUp ? 'Criar conta' : 'Entrar'}</h2>
      {error && <div className="text-red-600">{error}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
      <input value={pass} onChange={e => setPass(e.target.value)} placeholder="senha" type="password" />
      <button onClick={() => isSignUp ? onCreateAccount(email, pass) : onLogin(email, pass)}>
        {isSignUp ? 'Criar' : 'Entrar'}
      </button>
      <button onClick={() => setIsSignUp(s => !s)}>{isSignUp ? 'Já tenho conta' : 'Criar conta'}</button>
    </div>
  );
};
