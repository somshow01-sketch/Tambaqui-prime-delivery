
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Image as ImageIcon, 
  Users, 
  LogOut, 
  Plus, 
  Trash2,
  Loader2,
  Cloud,
  RefreshCw,
  Save,
  Tag,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Product } from '../../types';

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
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
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

const ProductForm: React.FC<{ product: Product; isProcessing: boolean }> = ({ product, isProcessing }) => {
  const { updateProduct } = useApp();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.pricePerKg.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      await updateProduct({
        ...product,
        name: name,
        pricePerKg: parseFloat(price) || product.pricePerKg
      });
    } catch (err) {
      alert("Erro ao salvar dados.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddImage = async (file: File) => {
    setIsSaving(true);
    try {
      const optimized = await optimizeImage(file);
      await updateProduct({
        ...product,
        images: [...product.images, optimized]
      });
    } catch (err) {
      alert("Erro no upload.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveImage = async (idx: number) => {
    if (product.images.length <= 1) {
      alert("O produto precisa de ao menos 1 foto.");
      return;
    }
    setIsSaving(true);
    try {
      await updateProduct({
        ...product,
        images: product.images.filter((_, i) => i !== idx)
      });
    } catch (err) {
      alert("Erro ao remover.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden">
      {isSaving && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-prime-green" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome do Produto</label>
          <div className="relative group">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-prime-green focus:bg-white transition-all font-bold text-slate-800"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Preço/Kg (R$)</label>
          <div className="relative group">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="number" 
              value={price} 
              onChange={e => setPrice(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 p-4 pl-12 rounded-2xl focus:outline-none focus:border-prime-green focus:bg-white transition-all font-black text-prime-green"
            />
          </div>
        </div>
        <button 
          onClick={handleSaveData}
          disabled={isSaving || isProcessing}
          className="bg-prime-dark text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save size={16} />
          Publicar Dados
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Galeria Global (Sincronizada)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {product.images.map((img, idx) => (
            <div key={idx} className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden border-2 border-slate-100 group shadow-sm">
              <img src={img} className="w-full h-full object-cover" alt={`${product.name} ${idx}`} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button 
                  onClick={() => handleRemoveImage(idx)} 
                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg active:scale-90 transition-all"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          ))}
          <label className="aspect-[4/5] rounded-[1.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:text-prime-green hover:border-prime-green hover:bg-prime-green/5 transition-all cursor-pointer group">
            <Plus size={32} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest mt-2">Adicionar Foto</span>
            <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleAddImage(e.target.files[0])} />
          </label>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { 
    orders, products, logout, isSyncing,
    appCoverImage, setAppCoverImage, syncWithCloud 
  } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sales' | 'images' | 'access'>('sales');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleCoverUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const optimizedUrl = await optimizeImage(file);
      await setAppCoverImage(optimizedUrl);
    } catch (err) {
      alert("Erro na capa.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      {(isProcessing || isSyncing) && (
        <div className="fixed inset-0 z-[100] bg-prime-dark/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <Loader2 size={48} className="animate-spin mb-4 text-prime-green" />
          <p className="font-black uppercase tracking-widest text-sm text-center">
            {isProcessing ? 'Sincronizando Mídia...' : 'Atualizando Rede Global...'}
          </p>
        </div>
      )}

      <aside className="w-full md:w-72 bg-[#0B0E14] text-white flex flex-col sticky top-0 md:h-screen shadow-2xl z-50">
        <div className="p-8 border-b border-white/5 flex flex-col items-center">
          <div className="flex flex-col mb-4">
            <span className="text-white font-black text-xl tracking-tight leading-none">TAMBAQUI</span>
            <span className="text-[#7DB131] font-black text-xl tracking-tight leading-none text-center">PRIME</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            {isSyncing ? <RefreshCw size={12} className="text-blue-400 animate-spin" /> : <Cloud size={12} className="text-prime-green" />}
            <span className="text-[9px] font-black uppercase tracking-widest">Global Sync</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex md:flex-col overflow-x-auto md:overflow-visible gap-2">
          {[
            { id: 'sales', icon: BarChart3, label: 'Vendas' },
            { id: 'images', icon: ImageIcon, label: 'Catálogo' },
            { id: 'access', icon: Users, label: 'Segurança' }
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
            onClick={syncWithCloud}
            className="w-full mb-2 flex items-center gap-4 p-5 text-prime-green hover:bg-white/5 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <RefreshCw size={16} /> Forçar Sync
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-5 text-slate-500 hover:text-red-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-400/5 transition-all"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-16 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              {activeTab === 'sales' && 'Controle de Vendas'}
              {activeTab === 'images' && 'Gestão Global'}
              {activeTab === 'access' && 'Segurança'}
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Alterações visíveis para todos os clientes</p>
          </div>
        </header>

        {activeTab === 'sales' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-prime-green/5 transition-colors">
                      <td className="px-8 py-6"><span className="font-mono font-bold text-prime-green">#{order.id}</span></td>
                      <td className="px-8 py-6 font-black text-slate-800 uppercase text-xs">{order.customerName}</td>
                      <td className="px-8 py-6 text-right font-black text-slate-900">R$ {order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div className="p-20 text-center text-slate-300 font-black uppercase text-xs tracking-widest">Nenhuma venda sincronizada.</div>}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-12">
            <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
               <div className="flex flex-col lg:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-2xl font-black text-prime-dark uppercase tracking-tighter">Banner Principal</h3>
                    <p className="text-slate-500 font-medium">Atualiza a imagem de destaque para todos os clientes.</p>
                    <label className="inline-flex bg-prime-dark text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs cursor-pointer hover:bg-slate-800 transition-all shadow-lg">
                      Trocar Capa
                      <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
                    </label>
                  </div>
                  <div className="w-full lg:w-[450px] aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img src={appCoverImage} className="w-full h-full object-cover" alt="Capa Atual" />
                  </div>
               </div>
            </section>
            <div className="grid grid-cols-1 gap-12">
              {products.map(product => (
                <ProductForm key={product.id} product={product} isProcessing={isProcessing} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'access' && (
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl max-w-3xl">
             <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-prime-green/10 rounded-2xl text-prime-green"><Users size={32} /></div>
              <h3 className="text-2xl font-black text-prime-dark uppercase tracking-tighter">Administração</h3>
            </div>
            <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center text-center">
              <AlertTriangle className="text-slate-200 mb-4" size={40} />
              <p className="text-slate-400 font-bold text-sm uppercase leading-relaxed max-w-xs">Dados e acessos sincronizados em tempo real via nuvem.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
