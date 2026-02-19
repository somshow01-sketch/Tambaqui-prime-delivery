
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ShoppingCart, User, Plus, Minus, RefreshCw } from 'lucide-react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useApp();
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    product.options?.[0]?.label
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.pricePerKg,
      quantity: quantity,
      selectedOption: product.options ? selectedOption : undefined
    });
    
    const btn = document.getElementById(`btn-${product.id}`);
    if (btn) {
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span class="text-sm font-black w-full text-center">ADICIONADO!</span>';
      btn.classList.replace('prime-gradient', 'bg-green-600');
      setTimeout(() => { 
        if (btn) {
          btn.innerHTML = originalContent;
          btn.classList.replace('bg-green-600', 'prime-gradient');
        }
      }, 1500);
    }
    setQuantity(1);
  };

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col transition-all hover:-translate-y-1 h-full border border-slate-100/50 group">
      <button
        id={`btn-${product.id}`}
        onClick={handleAddToCart}
        className="w-full prime-gradient text-white py-4 font-black uppercase tracking-tight flex items-center justify-between px-6 hover:brightness-110 active:scale-[0.98] transition-all z-10"
      >
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} fill="white" />
          <span className="text-sm font-black">ADICIONAR</span>
        </div>
        <span className="text-sm font-black">R$ {product.pricePerKg.toFixed(2)}</span>
      </button>

      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img 
          src={product.images[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {(product.isCarouselEnabled || product.images.length > 1) && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-full">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrentImageIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col bg-slate-50/30">
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-tight mb-1">{product.name}</h3>
          <p className="text-[#7DB131] font-black text-xl">
            R$ {product.pricePerKg.toFixed(2)}<span className="text-sm font-medium text-slate-400">/kg</span>
          </p>
        </div>

        {product.options && (
          <div className="mb-6 space-y-2">
            {product.options.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedOption(opt.label)}
                className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-black border uppercase transition-all flex justify-between items-center ${
                  selectedOption === opt.label 
                    ? 'bg-prime-green/10 border-prime-green text-prime-green' 
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                {opt.label}
                {selectedOption === opt.label && <div className="w-2 h-2 bg-prime-green rounded-full shadow-sm" />}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={decrement}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-prime-dark transition-colors"
          >
            <Minus size={16} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black text-slate-900">{quantity}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">kg</span>
          </div>
          <button 
            onClick={increment}
            className="w-9 h-9 rounded-xl bg-prime-dark text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StoreFront: React.FC = () => {
  const { products, cart, appCoverImage, isSyncing } = useApp();

  return (
    <div className="min-h-screen flex flex-col pb-32 bg-white">
      <header className="sticky top-0 z-40 bg-[#0B0E14] p-4 shadow-2xl">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white font-black text-xl tracking-tight leading-none">TAMBAQUI</span>
            <span className="text-[#7DB131] font-black text-xl tracking-tight leading-none text-right">PRIME</span>
          </div>
          <div className="flex items-center gap-4">
            {isSyncing && (
              <div className="flex items-center gap-2 animate-pulse">
                <RefreshCw size={14} className="text-prime-green animate-spin" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Sincronizando...</span>
              </div>
            )}
            <Link to="/admin/login" className="text-slate-400 hover:text-white transition-colors p-1">
              <User size={28} />
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full relative aspect-[16/7] md:aspect-[21/6] bg-[#0B0E14] overflow-hidden">
        <img 
          src={appCoverImage} 
          alt="Sabor da Amazônia" 
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/20 to-transparent">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-1">
              SABOR DA AMAZÔNIA
            </h2>
            <p className="text-sm md:text-lg text-slate-300 font-medium max-w-lg">
              O melhor tambaqui da região, limpo e pronto para o fogo.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="my-14 flex items-center gap-8 px-4">
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">CATÁLOGO OFICIAL</h2>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none">
          <Link
            to="/cart"
            className="pointer-events-auto max-w-md mx-auto w-full bg-[#0B0E14] text-white py-5 rounded-[2.5rem] shadow-2xl flex items-center justify-between px-10 font-black hover:bg-slate-900 active:scale-[0.98] transition-all border-4 border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={28} color="#7DB131" />
                <span className="absolute -top-2 -right-2 bg-[#7DB131] text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full shadow-sm font-black ring-2 ring-[#0B0E14]">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>
              <span className="uppercase tracking-tight text-lg">CARRINHO</span>
            </div>
            <span className="text-2xl font-black text-[#7DB131]">
              R$ {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default StoreFront;
