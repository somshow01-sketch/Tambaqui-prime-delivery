
import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Download, Home, Fish, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { GoogleGenAI } from "@google/genai";

const ReceiptPage: React.FC = () => {
  const { orderId } = useParams();
  const { orders } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const order = orders.find(o => o.id === orderId);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `nota-tambaqui-prime-${orderId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const sendToWhatsApp = async () => {
    if (!order) return;
    setIsGeneratingMessage(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Formate um pedido de peixe premium (Tambaqui Prime) para ser enviado via WhatsApp ao vendedor. 
      O tom deve ser profissional, claro e organizado.
      Dados do Pedido:
      ID: ${order.id}
      Cliente: ${order.customerName}
      Endereço: ${order.deliveryDetails.street}, ${order.deliveryDetails.number}, ${order.deliveryDetails.neighborhood}
      Itens: ${order.items.map(i => `${i.quantity}kg ${i.name} (${i.selectedOption || 'Inteiro'})`).join(', ')}
      Pagamento: ${order.paymentMethod} ${order.changeAmount ? `(Troco para ${order.changeAmount})` : ''}
      Total: R$ ${order.total.toFixed(2)}
      Retorne apenas o texto formatado com emojis adequados e espaçamento profissional.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      const message = encodeURIComponent(response.text || `Novo Pedido Tambaqui Prime - ID: ${order.id}`);
      window.open(`https://wa.me/5592991234567?text=${message}`, '_blank'); // Replace with store number
    } catch (error) {
      console.error("AI Generation failed", error);
      // Fallback message
      const fallback = encodeURIComponent(`Olá! Gostaria de confirmar meu pedido #${order.id}.\nNome: ${order.customerName}\nTotal: R$ ${order.total.toFixed(2)}`);
      window.open(`https://wa.me/5592991234567?text=${fallback}`, '_blank');
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  if (!order) {
    return <div className="p-12 text-center font-black uppercase text-slate-400 tracking-widest">Pedido não encontrado.</div>;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col items-center bg-slate-50 p-6 pb-20">
      <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 mt-8 shadow-xl shadow-green-500/20 animate-bounce">
        <CheckCircle2 size={40} />
      </div>
      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">Pedido Enviado!</h1>
      <p className="text-slate-500 mb-8 text-center font-bold text-sm uppercase tracking-tight">Obrigado por escolher Tambaqui Prime.</p>

      {/* The Printable Receipt */}
      <div 
        ref={receiptRef}
        className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden mb-10 border border-slate-100"
      >
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Fish className="text-blue-500" size={24} />
              <span className="font-black text-2xl uppercase tracking-tighter">Tambaqui Prime</span>
            </div>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Sabor Amazônico</p>
          </div>
          <div className="text-right relative z-10">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Comprovante</p>
            <p className="font-mono font-black text-xl text-blue-500">#{order.id}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Cliente</p>
                <p className="text-base font-black text-slate-800 uppercase leading-none">{order.customerName}</p>
                <p className="text-xs font-bold text-blue-500 mt-1">{order.whatsapp}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Local de Entrega</p>
                <p className="text-sm font-black text-slate-800 uppercase">
                  {order.deliveryDetails.street}, {order.deliveryDetails.number}
                </p>
                <p className="text-xs font-bold text-slate-500">{order.deliveryDetails.neighborhood}</p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-slate-100 pt-8">
            <h3 className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-6 text-center">Itens Selecionados</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start group">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.name}</p>
                    {item.selectedOption && (
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase">
                        {item.selectedOption}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-black text-slate-900 tracking-tighter">R$ {item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-4 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Subtotal + Frete</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
              <span className="text-lg font-black text-white uppercase tracking-tighter">Total a Pagar</span>
              <span className="text-4xl font-black text-blue-500 tracking-tighter">R$ {order.total.toFixed(2)}</span>
            </div>
            <div className="pt-2 flex justify-between items-center">
               <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Pagamento</span>
               <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-black uppercase">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 p-6 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] mb-1">Qualidade Tambaqui Prime</p>
          <p className="text-[9px] text-slate-300 font-bold uppercase">Siga-nos no Instagram @tambaquiprime</p>
        </div>
      </div>

      <div className="w-full space-y-4 max-w-sm sticky bottom-6">
        <button 
          onClick={sendToWhatsApp}
          disabled={isGeneratingMessage}
          className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-3 shadow-2xl shadow-green-600/30 hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isGeneratingMessage ? <Sparkles className="animate-pulse" /> : <Send size={22} />}
          {isGeneratingMessage ? 'Otimizando Mensagem...' : 'Enviar pelo WhatsApp'}
        </button>
        <button 
          onClick={downloadReceipt}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <Download size={22} /> Salvar Foto da Nota
        </button>
        <Link 
          to="/"
          className="w-full bg-white border-2 border-slate-200 text-slate-500 py-5 rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-center"
        >
          <Home size={22} /> Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default ReceiptPage;
