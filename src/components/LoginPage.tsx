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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">Care Monitor</h1>
          <h2 className="text-xl font-semibold text-center text-gray-700">
            {isSignUp ? 'Criar Conta' : 'Fazer Login'}
          </h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={() => (isSignUp ? onCreateAccount(email, pass) : onLogin(email, pass))}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            {isSignUp ? 'Já possui uma conta?' : 'Não possui uma conta?'}
          </p>
          <button
            onClick={() => setIsSignUp(s => !s)}
            className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors duration-200"
          >
            {isSignUp ? 'Fazer Login' : 'Criar Conta'}
          </button>
        </div>
      </div>
    </div>
  );
};
