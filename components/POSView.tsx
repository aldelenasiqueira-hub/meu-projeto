'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LayoutGrid, 
  Package, 
  History, 
  LogOut, 
  ShoppingCart, 
  UserPlus, 
  Minus, 
  Plus, 
  Tag, 
  FileText, 
  CreditCard,
  Trash2,
  Pause,
  Edit3,
  PlusCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Product } from '@/app/page';

const CATEGORIES = ['Todos os Produtos', 'Relógios', 'Artigos de Couro', 'Joias', 'Acessórios', 'Kits de Presente'];

interface POSViewProps {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
  onAddNew: () => void;
  onFinishSale: (items: (Product & { quantity: number })[]) => Promise<boolean>;
}

export default function POSView({ products, onDelete, onEdit, onAddNew, onFinishSale }: POSViewProps) {
  const [activeCategory, setActiveCategory] = useState('Todos os Produtos');
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'Todos os Produtos' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const addToCart = (product: Product) => {
    if (product.stock !== undefined && product.stock <= 0) {
      alert('Produto sem estoque!');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (product.stock !== undefined && existing.quantity >= product.stock) {
          alert('Quantidade máxima em estoque atingida!');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        if (delta > 0 && item.stock !== undefined && newQty > item.stock) {
          alert('Quantidade máxima em estoque atingida!');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleFinishSale = async () => {
    if (cart.length === 0) {
      alert('O carrinho está vazio!');
      return;
    }
    
    const success = await onFinishSale(cart);
    if (success) {
      setShowSuccessModal(true);
      setCart([]);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden relative">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="size-6" />
              </button>
              
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <CheckCircle2 className="size-12" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Venda Finalizada!</h3>
              <p className="text-slate-500 mb-8">O pedido foi processado com sucesso e o recibo foi enviado para o cliente.</p>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">ID da Transação</span>
                  <span className="font-mono font-bold text-slate-700">#LX-99281-B</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Método de Pagamento</span>
                  <span className="font-bold text-slate-700">Cartão de Crédito</span>
                </div>
              </div>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-4 font-bold text-lg shadow-lg shadow-primary/20 transition-all"
              >
                Continuar Vendendo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-primary/20 bg-white px-6 py-3 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-accent-red rounded-full flex items-center justify-center text-primary shadow-lg">
              <CreditCard className="size-6" />
            </div>
            <h2 className="text-slate-900 text-xl font-bold tracking-tight">LUXE <span className="text-primary">POS</span></h2>
          </div>
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input 
              className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary text-sm transition-all outline-none" 
              placeholder="Buscar produtos, SKUs ou códigos..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-md"
          >
            <PlusCircle className="size-4" />
            Novo Produto
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-sm font-semibold leading-none">James Harrington</p>
              <p className="text-xs text-slate-500">Gerente - Terminal 04</p>
            </div>
            <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary/30 overflow-hidden relative">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqMN6dAZSHbR6qrqGyyswwtRNhtyYTsSgNte-KVXbsr2o-m2HHddjHz37lcBaPsx0Tvo7Hy_2k72ZlCqLx60xs12FE0cOvnUr6fCG8z1ClVNTxM599hGnvGoIUajiayzRMNQnVDXRvmN8JqjVb7CNGAjWCwi2QYJXxuHHapYpjS9Q880a8t2eJzC5kR35L8PLnDMWj390xZmQ_0eDtLyzehrB4BMSaYj36qo_Q4Q6Okie3jCmPDd61PtDhFZyj4W5fVk4tc7OMiKbU" 
                alt="Perfil" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-20 bg-white border-r border-primary/10 flex flex-col items-center py-6 gap-6 shrink-0">
          <button className="flex flex-col items-center gap-1 text-primary group">
            <div className="p-3 bg-primary rounded-2xl text-white shadow-md group-hover:shadow-primary/50 transition-all">
              <LayoutGrid className="size-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Catálogo</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <div className="p-3 rounded-2xl">
              <Package className="size-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Estoque</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <div className="p-3 rounded-2xl">
              <History className="size-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Pedidos</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors mt-auto">
            <div className="p-3 rounded-2xl">
              <LogOut className="size-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Sair</span>
          </button>
        </nav>

        {/* Main Grid */}
        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg border-primary' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <motion.div 
                  layout
                  key={product.id}
                  className="bg-white p-3 rounded-2xl shadow-sm border border-primary/5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group relative"
                >
                  <div 
                    onClick={() => addToCart(product)}
                    className="aspect-square rounded-xl overflow-hidden mb-3 relative bg-slate-50"
                  >
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className={`object-cover group-hover:scale-110 transition-transform duration-500 ${product.stock !== undefined && product.stock <= 0 ? 'grayscale opacity-50' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    {product.stock !== undefined && product.stock <= 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] z-20">
                        <span className="bg-white/90 text-accent-red px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xl border border-accent-red/20">
                          Sem Estoque
                        </span>
                      </div>
                    )}
                    {product.badge && (
                      <div className={`absolute top-2 right-2 px-2 py-1 text-white text-[10px] font-bold rounded-full ${product.badge === 'LIMITADO' ? 'bg-accent-red' : 'bg-primary'}`}>
                        {product.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* CRUD Actions Overlay */}
                  <div className="absolute top-4 left-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                      className="size-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 hover:text-primary shadow-lg transition-colors"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                      className="size-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 hover:text-accent-red shadow-lg transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div onClick={() => addToCart(product)}>
                    <h3 className="font-bold text-slate-800 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-primary font-bold">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 uppercase font-medium">SKU: {product.sku}</span>
                        {product.stock !== undefined && (
                          <span className={`text-[9px] font-bold ${product.stock > 10 ? 'text-green-600' : 'text-accent-red'}`}>
                            Estoque: {product.stock}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* Order Summary */}
        <aside className="w-[400px] bg-white border-l border-primary/10 flex flex-col shrink-0">
          <div className="p-6 border-b border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="text-primary size-5" />
                Resumo do Pedido
              </h2>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">#8821</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <UserPlus className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">Cliente Avulso</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Conta Visitante</p>
                </div>
              </div>
              <button className="text-primary font-bold text-xs uppercase tracking-wider hover:underline">Alterar</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.id} 
                  className="flex items-center gap-3"
                >
                  <div className="size-14 rounded-lg overflow-hidden shrink-0 relative bg-slate-50">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">R$ {item.price.toLocaleString('pt-BR')} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="size-6 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="size-6 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <span className="font-bold text-sm min-w-[70px] text-right">R$ {(item.price * item.quantity).toLocaleString('pt-BR')}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-slate-50 border-t-2 border-primary/20">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Imposto de Serviço (5%)</span>
                <span className="font-semibold">R$ {tax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-dashed border-primary/30">
                <span className="font-bold text-lg">Total a Pagar</span>
                <span className="font-bold text-lg text-primary">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="flex items-center justify-center gap-2 py-3 rounded-full bg-white border-2 border-slate-200 font-bold text-sm hover:border-primary transition-all">
                <Tag className="size-4" />
                Desconto
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-full bg-white border-2 border-slate-200 font-bold text-sm hover:border-primary transition-all">
                <FileText className="size-4" />
                Notas
              </button>
            </div>
            <button 
              onClick={handleFinishSale}
              className="w-full bg-accent-red hover:bg-red-900 text-white rounded-full py-5 font-bold text-lg shadow-xl shadow-accent-red/20 transition-all flex items-center justify-center gap-3"
            >
              <CreditCard className="size-6" />
              Finalizar Venda
            </button>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setCart([])}
                className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-accent-red transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 className="size-3" /> Limpar Pedido
              </button>
              <button className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1">
                <Pause className="size-3" /> Aguardar
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
