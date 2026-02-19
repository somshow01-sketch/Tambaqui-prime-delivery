
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ShoppingCart, User, Plus, Minus } from 'lucide-react';

const LOGO_URL = "https://images.unsplash.com/photo-1621330396173-e41b16d17fb1?q=80&w=400&auto=format&fit=crop"; // Placeholder for the provided logo image concept

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
    alert(`${quantity}kg de ${product.name} adicionado ao carrinho!`);
    setQuantity(1);
  };

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const totalPrice = product.pricePerKg * quantity;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-video bg-slate-200">
        <img 
          src={product.images[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {product.isCarouselEnabled && product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-full">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-tight">{product.name}</h3>
          <p className="text-prime-green font-black text-2xl mt-1">R$ {product.pricePerKg.toFixed(2)}<span className="text-sm font-medium text-slate-400">/kg</span></p>
        </div>

        {product.options && (
          <div className="mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Como deseja seu peixe?</p>
            <div className="grid gap-2">
              {product.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.label)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all flex justify-between items-center ${
                    selectedOption === opt.label 
                      ? 'bg-prime-green/5 border-prime-green text-prime-green ring-2 ring-prime-green/10' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedOption === opt.label ? 'border-prime-green bg-prime-green' : 'border-slate-300'}`}>
                    {selectedOption === opt.label && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Quanto você precisa?</p>
          <div className="flex items-center justify-between">
            <button 
              onClick={decrement}
              className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm active:scale-95"
            >
              <Minus size={20} />
            </button>
            <div className="text-center">
              <span className="text-3xl font-black text-slate-900 leading-none">{quantity}</span>
              <span className="text-sm font-black text-slate-400 uppercase ml-1">kg</span>
            </div>
            <button 
              onClick={increment}
              className="w-12 h-12 rounded-xl bg-prime-dark text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-auto w-full prime-gradient text-white py-4 rounded-2xl font-black uppercase tracking-tighter flex items-center justify-between px-6 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-prime-green/20"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <span>Adicionar</span>
          </div>
          <span className="text-lg">R$ {totalPrice.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};

const StoreFront: React.FC = () => {
  const { products, cart, appCoverImage } = useApp();

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col pb-28">
      {/* Header com Fundo do Logo */}
      <header className="sticky top-0 z-40 bg-prime-dark border-b border-white/5 p-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder - Representa a imagem enviada pelo usuário */}
          <div className="w-40 h-10 flex items-center">
            <img 
              src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/tambaqui-prime-logo-white.png" 
              alt="Tambaqui Prime Logo" 
              className="h-full object-contain"
              onError={(e) => {
                // Fallback text if logo image is not found
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = '<span class="text-white font-black text-xl tracking-tighter uppercase">TAMBAQUI <span class="text-prime-green">PRIME</span></span>';
              }}
            />
          </div>
        </div>
        <Link to="/admin/login" className="p-2 text-slate-500 hover:text-prime-orange transition-colors">
          <User size={24} />
        </Link>
      </header>

      {/* Hero */}
      <div className="w-full aspect-[21/9] relative bg-slate-800">
        <img src={appCoverImage} alt="Cover" className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-prime-dark via-prime-dark/40 to-transparent">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Sabor da Amazônia</h2>
          <p className="text-sm text-slate-300 font-medium">O melhor tambaqui da região, limpo e pronto para o fogo.</p>
        </div>
      </div>

      {/* Catalog */}
      <main className="p-4 grid gap-8 mt-4">
        <div className="flex items-center gap-3">
          <div className="h-[2px] flex-1 bg-slate-100"></div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Peixaria Prime</h2>
          <div className="h-[2px] flex-1 bg-slate-100"></div>
        </div>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
          <Link
            to="/cart"
            className="max-w-sm mx-auto w-full bg-prime-dark text-white py-5 rounded-[2rem] shadow-2xl shadow-black/40 flex items-center justify-between px-8 font-black hover:bg-slate-900 active:scale-[0.98] transition-all border-4 border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={26} />
                <span className="absolute -top-2 -right-2 bg-prime-green text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm font-black">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
              </div>
              <span className="uppercase tracking-tight text-lg">Ver Carrinho</span>
            </div>
            <span className="text-xl">R$ {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default StoreFront;