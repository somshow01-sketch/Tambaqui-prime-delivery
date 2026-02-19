
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { DELIVERY_FEE } from '../../constants';

const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-black uppercase text-slate-800 mb-2">Seu carrinho está vazio</h2>
        <p className="text-slate-500 mb-10 font-medium">Selecione o peso ideal dos nossos tambaquis para continuar.</p>
        <Link to="/" className="max-w-sm w-full prime-gradient text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">
          Escolher Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-32 bg-slate-50">
      <header className="bg-prime-dark border-b border-white/5 p-6 sticky top-0 z-30">
        <div className="container mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tighter text-white">Meu Pedido</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-md">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-prime-green text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase leading-none">{item.quantity}kg</span>
                  <h3 className="font-black text-slate-800 uppercase text-base tracking-tight">{item.name}</h3>
                </div>
                {item.selectedOption && (
                  <p className="text-[11px] text-prime-green font-black uppercase tracking-widest">{item.selectedOption}</p>
                )}
                <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">Preço unitário: R$ {item.price.toFixed(2)}/kg</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Subtotal</p>
                  <span className="font-black text-slate-900 text-xl tracking-tighter">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => removeFromCart(index)}
                  className="w-12 h-12 flex items-center justify-center text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 sticky top-28">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Resumo da Compra</h2>
            <div className="flex justify-between items-center text-slate-500 font-bold text-sm uppercase tracking-widest">
              <span>Produtos</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-prime-green font-black text-sm uppercase tracking-widest">
              <span>Taxa de Entrega</span>
              <span>R$ {DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total do Pedido</span>
              <span className="text-4xl font-black text-prime-green tracking-tighter">R$ {total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-prime-dark text-white py-5 mt-6 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl hover:bg-slate-900 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <span>Avançar para Entrega</span>
              <ArrowLeft className="rotate-180" size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
