
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CheckCircle2, Wallet, Truck, MessageSquare, AlertCircle } from 'lucide-react';
import { DELIVERY_FEE } from '../../constants';
import { DeliveryDetails, PaymentMethod, Order } from '../../types';

const CheckoutPage: React.FC = () => {
  const { cart, addOrder, clearCart } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<'delivery' | 'payment' | 'confirm'>('delivery');
  const [details, setDetails] = useState<DeliveryDetails>({
    name: '', street: '', number: '', neighborhood: '', whatsapp: '', observations: ''
  });
  const [payment, setPayment] = useState<PaymentMethod | ''>('');
  const [changeAmount, setChangeAmount] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + DELIVERY_FEE;

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.name || !details.street || !details.number || !details.neighborhood || !details.whatsapp) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (!payment) {
      alert('Selecione uma forma de pagamento.');
      return;
    }
    setStep('confirm');
  };

  const handleFinalize = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerName: details.name,
      whatsapp: details.whatsapp,
      date: new Date().toISOString(),
      items: cart,
      deliveryDetails: details,
      paymentMethod: payment as PaymentMethod,
      changeAmount: payment === 'ESPECIE' ? changeAmount : undefined,
      deliveryFee: DELIVERY_FEE,
      total: total
    };

    addOrder(newOrder);
    clearCart();
    navigate(`/receipt/${newOrder.id}`);
  };

  const inputClass = "w-full bg-[#FFFFFF] text-[#000000] placeholder-[#6E6E6E] border-[#D9D9D9] p-4 rounded-xl border focus:ring-4 focus:ring-prime-green/10 focus:border-prime-green focus:outline-none transition-all font-medium text-lg";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-prime-dark border-b border-white/5 p-6 sticky top-0 z-30">
        <div className="container mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight text-white">Finalizar Pedido</h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-[73px] z-20">
        <div className="container mx-auto max-w-xl flex px-6 py-5">
          {['delivery', 'payment', 'confirm'].map((s, idx) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-2 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all z-10 ${
                step === s ? 'bg-prime-green text-white shadow-lg shadow-prime-green/30 scale-110' : 
                (idx < ['delivery', 'payment', 'confirm'].indexOf(step) ? 'bg-prime-orange text-white' : 'bg-slate-100 text-slate-400')
              }`}>
                {idx < ['delivery', 'payment', 'confirm'].indexOf(step) ? <CheckCircle2 size={20} /> : idx + 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === s ? 'text-prime-green' : 'text-slate-400'}`}>
                {s === 'delivery' ? 'Entrega' : s === 'payment' ? 'Pagamento' : 'Revisão'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-8 flex-1 max-w-2xl">
        {step === 'delivery' && (
          <form onSubmit={handleDeliverySubmit} className="space-y-6 animate-in fade-in duration-300">
            <div className="prime-gradient p-6 rounded-[2rem] flex items-center gap-5 text-white shadow-lg shadow-prime-green/20">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Truck size={36} />
              </div>
              <div>
                <p className="text-xl font-black uppercase tracking-tight">Entrega Prime: R$ 5,00</p>
                <p className="text-sm text-white/80 font-medium">Taxa fixa para toda a região.</p>
              </div>
            </div>

            <div className="space-y-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-prime-green rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Onde Entregar?</h3>
              </div>
              
              <input 
                type="text" placeholder="Seu Nome Completo *" required
                className={inputClass}
                value={details.name} onChange={e => setDetails({...details, name: e.target.value})}
              />
              <div className="grid grid-cols-4 gap-4">
                <input 
                  type="text" placeholder="Rua *" required
                  className={`${inputClass} col-span-3`}
                  value={details.street} onChange={e => setDetails({...details, street: e.target.value})}
                />
                <input 
                  type="text" placeholder="Nº *" required
                  className={`${inputClass} col-span-1 text-center`}
                  value={details.number} onChange={e => setDetails({...details, number: e.target.value})}
                />
              </div>
              <input 
                type="text" placeholder="Bairro *" required
                className={inputClass}
                value={details.neighborhood} onChange={e => setDetails({...details, neighborhood: e.target.value})}
              />
              <input 
                type="tel" placeholder="WhatsApp (DDD + Número) *" required
                className={inputClass}
                value={details.whatsapp} onChange={e => setDetails({...details, whatsapp: e.target.value})}
              />
              <textarea 
                placeholder="Observações (ex: ponto de referência, complemento)"
                className={`${inputClass} min-h-[120px] resize-none`}
                value={details.observations} onChange={e => setDetails({...details, observations: e.target.value})}
              />
            </div>
            
            <button type="submit" className="w-full bg-prime-dark text-white py-5 rounded-[2rem] font-black uppercase tracking-tight shadow-xl hover:bg-slate-900 active:scale-[0.98] transition-all">
              Prosseguir para Pagamento
            </button>
          </form>
        )}

        {step === 'payment' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4 px-2">
              <div className="p-3 bg-prime-green/10 rounded-2xl text-prime-green">
                <Wallet size={28} />
              </div>
              Como deseja pagar?
            </h2>
            <div className="grid gap-4">
              {[
                { id: 'PIX', label: 'PIX (Instantâneo)' },
                { id: 'DEBITO_CREDITO', label: 'Cartão (Entregador leva a máquina)' },
                { id: 'ESPECIE', label: 'Espécie (Dinheiro)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPayment(opt.id as PaymentMethod)}
                  className={`p-6 rounded-[2rem] border-2 text-left flex items-center justify-between transition-all group ${
                    payment === opt.id ? 'border-prime-green bg-prime-green/5 shadow-md ring-4 ring-prime-green/10' : 'border-white bg-white shadow-sm'
                  }`}
                >
                  <span className={`font-black uppercase tracking-tight text-base ${payment === opt.id ? 'text-prime-green' : 'text-slate-600'}`}>{opt.label}</span>
                  {payment === opt.id ? <CheckCircle2 className="text-prime-green" size={28} /> : <div className="w-7 h-7 rounded-full border-2 border-slate-200 group-hover:border-prime-green/20" />}
                </button>
              ))}
            </div>

            {payment === 'ESPECIE' && (
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 text-slate-800">
                  <AlertCircle size={22} className="text-prime-green" />
                  <p className="text-base font-black uppercase tracking-tight">Troco para quanto?</p>
                </div>
                <input 
                  type="text" placeholder="Ex: R$ 50,00 ou R$ 100,00"
                  className={inputClass}
                  value={changeAmount} onChange={e => setChangeAmount(e.target.value)}
                />
              </div>
            )}

            <button 
              onClick={handlePaymentSubmit}
              className="w-full bg-prime-dark text-white py-5 rounded-[2rem] font-black uppercase tracking-tight shadow-xl hover:bg-slate-900 active:scale-[0.98] transition-all mt-6"
            >
              Revisar Pedido
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-prime-green p-8 rounded-[2.5rem] text-white shadow-xl shadow-prime-green/20 text-center space-y-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare size={40} />
              </div>
              <h2 className="text-2xl font-black uppercase leading-tight tracking-tighter">
                Tudo pronto? Confira seus dados.
              </h2>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.3em]">RESUMO OPERACIONAL</h3>
                <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[11px] text-slate-500 font-black uppercase tracking-tighter">{cart.length} PRODUTOS</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Destinatário</p>
                  <p className="text-lg font-black text-slate-800 uppercase">{details.name}</p>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed">{details.street}, {details.number} - {details.neighborhood}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Pagamento Escolhido</p>
                  <p className="text-lg font-black text-slate-800 uppercase leading-none">
                    {payment === 'ESPECIE' ? 'Dinheiro' : payment === 'PIX' ? 'PIX' : 'Cartão'}
                  </p>
                  {payment === 'ESPECIE' && changeAmount && (
                    <p className="mt-2 text-[10px] bg-prime-green/10 text-prime-green px-3 py-1.5 rounded-xl inline-block font-black uppercase tracking-tight">Troco para: {changeAmount}</p>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-3">
                 <div className="flex justify-between items-center text-slate-500 font-bold text-sm uppercase">
                    <span>Subtotal + Frete</span>
                    <span>R$ {total.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-2xl font-black text-slate-900 pt-4">
                    <span className="uppercase tracking-tighter text-prime-orange">Total Final</span>
                    <span className="text-4xl text-prime-green tracking-tighter font-black">R$ {total.toFixed(2)}</span>
                 </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => setStep('delivery')}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-500 py-5 rounded-[2rem] font-black uppercase tracking-tight hover:bg-slate-50 transition-all"
              >
                Voltar
              </button>
              <button 
                onClick={handleFinalize}
                className="flex-[2] bg-prime-green text-white py-5 rounded-[2rem] font-black uppercase tracking-tight shadow-xl shadow-prime-green/20 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Confirmar e Finalizar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;
