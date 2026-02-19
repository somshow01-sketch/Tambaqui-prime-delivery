
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Image as ImageIcon, 
  Users, 
  LogOut, 
  Plus, 
  Save, 
  Upload,
  Trash2,
  RefreshCw,
  Smartphone,
  Check,
  ChevronRight,
  Eye,
  Loader2
} from 'lucide-react';
import { Product, AdminUser } from '../../types';

const optimizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const AdminDashboard: React.FC = () => {
  const { 
    orders, products, admins, logout, 
    updateProduct, addAdmin, appCoverImage, setAppCoverImage 
  } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sales' | 'images' | 'access'>('sales');
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleImageUpload = async (productId: string, file: File) => {
    setIsProcessing(true);
    try {
      const optimizedUrl = await optimizeImage(file);
      const prod = products.find(p => p.id === productId);
      if (prod) {
        updateProduct({ ...prod, images: [...prod.images, optimizedUrl] });
      }
    } catch (err) {
      alert("Erro ao processar imagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReplaceImage = async (productId: string, index: number, file: File) => {
    setIsProcessing(true);
    try {
      const optimizedUrl = await optimizeImage(file);
      const prod = products.find(p => p.id === productId);
      if (prod) {
        const newImages = [...prod.images];
        newImages[index] = optimizedUrl;
        updateProduct({ ...prod, images: newImages });
      }
    } catch (err) {
      alert("Erro ao processar imagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteImage = (productId: string, index: number) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      if (prod.images.length <= 1) {
        alert("O produto deve ter ao menos 1 imagem ativa no catálogo.");
        return;
      }
      const newImages = prod.images.filter((_, i) => i !== index);
      updateProduct({ ...prod, images: newImages });
    }
  };

  const handleCoverUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const optimizedUrl = await optimizeImage(file);
      setAppCoverImage(optimizedUrl);
    } catch (err) {
      alert("Erro ao processar imagem de capa.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-prime-dark/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <Loader2 size={48} className="animate-spin mb-4 text-prime-green" />
          <p className="font-black uppercase tracking-widest text-sm">Otimizando Imagem...</p>
        </div>
      )}

      {/* Sidebar Administrativa Harmonizada */}
      <aside className="w-full md:w-72 bg-prime-dark text-white flex flex-col sticky top-0 md:h-screen">
        <div className="p-8 border-b border-white/5 flex items-center justify-center">
          <img 
            src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/tambaqui-prime-logo-white.png" 
            alt="Logo Admin" 
            className="h-12 object-contain"
          />
        </div>
        
        <nav className="flex-1 p-4 flex md:flex-col overflow-x-auto md:overflow-visible gap-2">
          {[
            { id: 'sales', icon: BarChart3, label: 'Vendas' },
            { id: 'images', icon: ImageIcon, label: 'Catálogo' },
            { id: 'access', icon: Users, label: 'Acessos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 md:flex-none flex items-center gap-4 p-5 rounded-[1.25rem] font-black uppercase text-xs tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-prime-green text-white shadow-xl shadow-prime-green/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <tab.icon size={20} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-5 text-slate-500 hover:text-red-400 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-red-400/5 transition-all"
          >
            <LogOut size={20} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-16 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              {activeTab === 'sales' && 'Controle de Vendas'}
              {activeTab === 'images' && 'Gestão Visual'}
              {activeTab === 'access' && 'Segurança'}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] ml-1">
              Painel Administrativo Tambaqui Prime
            </p>
          </div>
          {activeTab === 'sales' && (
            <div className="bg-prime-green/5 border border-prime-green/10 px-6 py-4 rounded-3xl">
              <p className="text-[10px] font-black text-prime-green uppercase tracking-widest mb-1 text-center">Volume de Vendas</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">R$ {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
            </div>
          )}
        </header>

        {activeTab === 'sales' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cliente</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">WhatsApp</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-prime-green/5 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="font-mono font-bold text-prime-green bg-prime-green/10 px-3 py-1.5 rounded-lg text-sm">#{order.id}</span>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-800 uppercase text-xs">{order.customerName}</td>
                      <td className="px-8 py-6">
                        <a href={`https://wa.me/55${order.whatsapp.replace(/\D/g,'')}`} target="_blank" className="text-xs font-black text-prime-green underline">Abrir Conversa</a>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-slate-900">R$ {order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-12">
            <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
               <div className="flex flex-col lg:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-2xl font-black text-prime-dark uppercase tracking-tighter">Capa do App</h3>
                    <p className="text-slate-500 font-medium">Troque a imagem principal que os clientes veem no topo.</p>
                    <label className="inline-flex bg-prime-dark text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs cursor-pointer hover:brightness-125 transition-all">
                      Substituir Capa
                      <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
                    </label>
                  </div>
                  <div className="w-full lg:w-[400px] aspect-video rounded-[2rem] overflow-hidden shadow-2xl">
                    <img src={appCoverImage} className="w-full h-full object-cover" />
                  </div>
               </div>
            </section>

            <div className="grid gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black text-prime-dark uppercase tracking-tighter">{product.name}</h4>
                    <span className="text-prime-green font-black">R$ {product.pricePerKg.toFixed(2)}/kg</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-slate-100 group">
                        <img src={img} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-prime-dark/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <button onClick={() => handleDeleteImage(product.id, idx)} className="p-2 bg-red-500 text-white rounded-lg"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                    <label className="aspect-square rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:text-prime-green hover:border-prime-green transition-all cursor-pointer">
                      <Plus size={32} />
                      <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(product.id, e.target.files[0])} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;