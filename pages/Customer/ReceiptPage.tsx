
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
    try {
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
    } catch (err) {
      console.error("Falha ao baixar nota", err);
      alert("Não foi possível gerar a imagem da nota. Tente novamente.");
    }
  };

  const sendToWhatsApp = async () => {
    if (!order) return;
    setIsGeneratingMessage(true);
    
    const STORE_PHONE = "5592991234567";
    
    try {
      const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || (window as any).process?.env?.API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key não encontrada");
      }

      const ai = new GoogleGenAI({ apiKey });
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

      const messageText = response.text || `Novo Pedido Tambaqui Prime - ID: ${order.id}`;
      const encodedMessage = encodeURIComponent(messageText);
      window.open(`https://wa.me/${STORE_PHONE}?text=${encodedMessage}`, '_blank');
    } catch (error) {
      console.error("AI Generation failed", error);
      const fallbackMsg = `🐟 *TAMBAQUI PRIME - PEDIDO #${order.id}*\n\n` +
        `👤 *Cliente:* ${order.customerName}\n` +
        `📍 *Endereço:* ${order.deliveryDetails.street}, ${order.deliveryDetails.number}, ${order.deliveryDetails.neighborhood}\n` +
        `🛍️ *Itens:* ${order.items.map(i => `${i.quantity}kg ${i.name}`).join(', ')}\n` +
        `💳 *Pagamento:* ${order.paymentMethod}\n` +
        `💰 *Total:* R$ ${order.total.toFixed(2)}`;
      
      window.open(`https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(fallbackMsg)}`, '_blank');
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  if (!order) {
    return (
      <div className="p-12 text-center container mx-auto">
        <p className="font-black uppercase text-slate-400 tracking-widest mb-4">Pedido não encontrado.</p>
        <Link to="/" className="text-prime-green font-bold underline">Voltar para a loja</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 p-4 md:p-8 pb-32">
      <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 mt-10 shadow-2xl shadow-green-500/20 animate-bounce">
        <CheckCircle2 size={56} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2 text-center leading-none">Pedido Recebido!</h1>
      <p className="text-slate-500 mb-12 text-center font-bold text-sm uppercase tracking-[0.2em]">Obrigado por escolher Tambaqui Prime.</p>

      <div 
        ref={receiptRef}
        className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden mb-12 border border-slate-100"
      >
        <div className="bg-prime-dark p-10 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-2">
              <Fish className="text-prime-green" size={32} />
              <span className="font-black text-3xl uppercase tracking-tighter">Tambaqui Prime</span>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">Sabor da Amazônia</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest mb-1">Comprovante do Pedido</p>
            <p className="font-mono font-black text-3xl text-prime-green">#{order.id}</p>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Cliente</p>
                <p className="text-lg font-black text-slate-800 uppercase leading-none">{order.customerName}</p>
                <p className="text-sm font-bold text-prime-green mt-1">{order.whatsapp}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Local de Entrega</p>
                <p className="text-base font-black text-slate-800 uppercase">
                  {order.deliveryDetails.street}, {order.deliveryDetails.number}
                </p>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{order.deliveryDetails.neighborhood}</p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-slate-100 pt-10">
            <h3 className="text-[11px] text-slate-400 uppercase font-black tracking-[0.4em] mb-8 text-center">DETALHES DO PEDIDO</h3>
            <div className="space-y-6">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-lg font-black text-slate-800 uppercase tracking-tight">
                      <span className="text-prime-green mr-3">{item.quantity}kg</span>
                      {item.name}
                    </p>
                    {item.selectedOption && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-black uppercase tracking-tight">
                        {item.selectedOption}
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-black text-slate-900 tracking-tighter">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-prime-dark rounded-[2.5rem] p-10 text-white space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-prime-green/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
              <span>Subtotal + Taxa</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
            <div className="pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
              <span className="text-xl font-black text-white uppercase tracking-tighter">Total Geral</span>
              <span className="text-5xl font-black text-prime-green tracking-tighter">R$ {order.total.toFixed(2)}</span>
            </div>
            <div className="pt-2 flex justify-between items-center relative z-10">
               <span className="text-[11px] text-slate-500 uppercase font-black tracking-[0.2em]">Meio de Pagamento</span>
               <span className="text-[11px] bg-prime-green/20 text-prime-green px-4 py-1.5 rounded-full font-black uppercase tracking-widest">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.6em] mb-2">TAMBAQUI PRIME</p>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">A melhor experiência em pescados</p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4 fixed bottom-6 left-1/2 -translate-x-1/2 px-4">
        <button 
          onClick={sendToWhatsApp}
          disabled={isGeneratingMessage}
          className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-tight flex items-center justify-center gap-3 shadow-2xl shadow-green-600/30 hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isGeneratingMessage ? <Sparkles className="animate-pulse" /> : <Send size={24} />}
          {isGeneratingMessage ? 'Formatando...' : 'Enviar para o WhatsApp'}
        </button>
        <div className="flex gap-3">
          <button 
            onClick={downloadReceipt}
            className="flex-1 bg-prime-dark text-white py-5 rounded-[2rem] font-black uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            <Download size={20} /> Nota
          </button>
          <Link 
            to="/"
            className="flex-1 bg-white border-2 border-slate-200 text-slate-500 py-5 rounded-[2rem] font-black uppercase tracking-tight flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-center"
          >
            <Home size={20} /> Início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
