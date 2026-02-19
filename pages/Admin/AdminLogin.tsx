
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Lock, User, ArrowLeft, Fish, Check } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('tp_remembered_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password, rememberMe)) {
      navigate('/admin/dashboard');
    } else {
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-900 text-white p-6">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12">
        <ArrowLeft size={20} /> Voltar à loja
      </Link>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-blue-500/20">
            <Fish size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Área <span className="text-blue-500">Admin</span></h1>
          <p className="text-slate-400 mt-2">Acesse o painel de gerenciamento.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" placeholder="Nome (Login)" required
              className="w-full bg-slate-800 border border-slate-700 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
              value={username} onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="password" placeholder="Senha" required
              className="w-full bg-slate-800 border border-slate-700 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                  rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-700 bg-slate-800'
                }`}
              >
                {rememberMe && <Check size={16} className="text-white" />}
              </div>
              <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors select-none">
                Salvar login
              </span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/10 transition-all active:scale-[0.98] mt-4"
          >
            Acessar Painel
          </button>
        </form>
      </div>

      <p className="text-center text-slate-600 text-xs mt-12">
        &copy; 2024 Tambaqui Prime - Gestão Segura
      </p>
    </div>
  );
};

export default AdminLogin;
