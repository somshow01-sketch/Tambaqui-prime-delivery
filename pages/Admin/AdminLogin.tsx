
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
    <div className="min-h-screen flex flex-col bg-slate-900 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-prime-green/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-prime-orange/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px] pointer-events-none"></div>

      <div className="container mx-auto max-w-lg relative z-10 flex-1 flex flex-col">
        <Link to="/" className="inline-flex items-center gap-3 text-slate-400 hover:text-white transition-all mb-16 group">
          <div className="p-2 rounded-full group-hover:bg-white/5 transition-all">
            <ArrowLeft size={24} />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Voltar à loja</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-prime-green rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-prime-green/30 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Fish size={48} />
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-3">
              ÁREA <span className="text-prime-green">ADMIN</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Painel de Gerenciamento Prime</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-prime-green transition-colors" size={24} />
                <input 
                  type="text" placeholder="Nome de Usuário" required
                  className="w-full bg-slate-800/50 border-2 border-slate-800 p-5 pl-14 rounded-2xl focus:outline-none focus:border-prime-green focus:bg-slate-800 transition-all text-lg font-bold placeholder-slate-600"
                  value={username} onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-prime-green transition-colors" size={24} />
                <input 
                  type="password" placeholder="Senha de Acesso" required
                  className="w-full bg-slate-800/50 border-2 border-slate-800 p-5 pl-14 rounded-2xl focus:outline-none focus:border-prime-green focus:bg-slate-800 transition-all text-lg font-bold placeholder-slate-600"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-7 h-7 rounded-xl border-2 transition-all flex items-center justify-center ${
                    rememberMe ? 'bg-prime-green border-prime-green shadow-lg shadow-prime-green/20' : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  {rememberMe && <Check size={18} className="text-white" />}
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors select-none">
                  Lembrar Acesso
                </span>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-prime-green text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-prime-green/20 hover:brightness-110 active:scale-[0.98] transition-all mt-6"
            >
              Acessar Painel Master
            </button>
          </form>
        </div>

        <footer className="mt-20 text-center">
          <p className="text-slate-700 font-black uppercase tracking-[0.5em] text-[10px] mb-2">
            SISTEMA DE GESTÃO PRIME
          </p>
          <div className="h-[2px] w-12 bg-slate-800 mx-auto"></div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLogin;
