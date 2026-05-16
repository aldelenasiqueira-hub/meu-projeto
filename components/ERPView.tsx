'use client';

import React from 'react';
import { 
  Package, 
  CloudUpload, 
  CirclePlus, 
  Save, 
  Shield, 
  CircleHelp, 
  FileCode2,
  X,
  Search,
  Edit3,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/app/page';

interface ERPViewProps {
  products: Product[];
  onSave: (product: Omit<Product, 'id'> & { id?: number }) => void;
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
  onSeed: () => void;
  editingProduct: Product | null;
  onCancel: () => void;
}

export default function ERPView({ products, onSave, onDelete, onEdit, onSeed, editingProduct, onCancel }: ERPViewProps) {
  const [showForm, setShowForm] = React.useState(!!editingProduct);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSeeding, setIsSeeding] = React.useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    await onSeed();
    setIsSeeding(false);
  };
  const [formData, setFormData] = React.useState({
    name: editingProduct?.name || '',
    sku: editingProduct?.sku || '',
    category: editingProduct?.category || 'Relógios',
    price: editingProduct?.price || 0,
    cost: editingProduct?.cost || 0,
    stock: editingProduct?.stock || 0,
    image: editingProduct?.image || 'https://picsum.photos/seed/luxury/800/600'
  });

  React.useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        sku: editingProduct.sku,
        category: editingProduct.category,
        price: editingProduct.price,
        cost: editingProduct.cost || 0,
        stock: editingProduct.stock || 0,
        image: editingProduct.image
      });
      setShowForm(true);
    }
  }, [editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: editingProduct?.id
    });
    setShowForm(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setFormData({
      name: '',
      sku: '',
      category: 'Relógios',
      price: 0,
      cost: 0,
      stock: 0,
      image: 'https://picsum.photos/seed/luxury/800/600'
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] flex flex-col">
      {/* Top Nav */}
      <header className="flex items-center justify-between border-b border-primary/20 bg-white px-6 md:px-20 py-4 shrink-0">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-8 bg-primary/10 rounded flex items-center justify-center">
            <Package className="size-5" />
          </div>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">Elite ERP</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <nav className="hidden md:flex items-center gap-9">
            <button className="text-slate-700 text-sm font-medium hover:text-primary transition-colors">Painel</button>
            <button className="text-primary text-sm font-bold border-b-2 border-primary">Inventário</button>
            <button className="text-slate-700 text-sm font-medium hover:text-primary transition-colors">Vendas</button>
            <button className="text-slate-700 text-sm font-medium hover:text-primary transition-colors">Relatórios</button>
          </nav>
          <div className="size-10 rounded-full border-2 border-primary/30 overflow-hidden relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwFGHGgL7vhhhocaFPTEdotICiW86AzjAHlT9iiFlhxx0f-uQ_NEmja1ksp6zuF1bdm3BeRU3X3Bh041tSW79i4JjZQz_guqEM8SbHdyYgviSnmNRv8WMZPJz4xxZQbQi0QAHQEHUZufA5NlX0Z1ewlAxWpGUpApTFkXJNXyrxy8JTepiCBCR9oJRXGzwKYO7S3Vcsa8Sp8FRI-UDl9QZrn0j30yI3ZcAJMUeXnMcwp9v3o2UI1TTRO9ATIVGSF2XS7kN5zSo7daQo" 
              alt="Usuário" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-10 px-4">
        {showForm ? (
          <form onSubmit={handleSubmit} className="max-w-[1000px] flex-1 bg-white rounded-xl shadow-sm border border-primary/10 overflow-hidden flex flex-col h-fit">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-8 border-b border-primary/10 bg-primary/5">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 text-3xl font-black leading-tight tracking-tight">
                  {editingProduct ? 'Editar Produto' : 'Cadastro de Produto'}
                </p>
                <p className="text-slate-500 text-base font-normal">
                  {editingProduct ? `Atualizando ${editingProduct.name}` : 'Adicione ativos de alto valor ao seu sistema de inventário global'}
                </p>
              </div>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      const randomId = Math.floor(Math.random() * 10000);
                      setFormData({
                        name: `Produto de Luxo #${randomId}`,
                        sku: `LX-${randomId}`,
                        category: 'Relógios',
                        price: 1500 + Math.floor(Math.random() * 5000),
                        cost: 500 + Math.floor(Math.random() * 1000),
                        stock: 10 + Math.floor(Math.random() * 50),
                        image: `https://picsum.photos/seed/luxury-${randomId}/800/600`
                      });
                    }}
                    className="text-primary text-sm font-bold hover:underline"
                  >
                    Gerar Dados de Teste
                  </button>
                  <CirclePlus className="text-accent-red size-10" />
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-slate-900 text-lg font-bold leading-tight border-l-4 border-primary pl-3">Mídia do Produto</h3>
                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-xl aspect-square bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer overflow-hidden">
                  {formData.image ? (
                    <Image src={formData.image} alt="Preview" fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-center p-6">
                      <CloudUpload className="size-12 text-primary mb-2 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700">Enviar Imagem</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG até 10MB</p>
                    </div>
                  )}
                  <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-slate-900/40 rounded-xl">
                    <button type="button" className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg">Alterar Imagem</button>
                  </div>
                </div>
                <div className="bg-[#f8f7f6] p-4 rounded-lg">
                  <p className="text-xs font-bold text-accent-red uppercase tracking-wider mb-2">Padrões de Qualidade</p>
                  <p className="text-xs text-slate-600 leading-relaxed">Certifique-se de que a imagem do produto esteja em um fundo branco com proporção 4:3 para consistência do catálogo.</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-slate-900 text-lg font-bold leading-tight border-l-4 border-primary pl-3 mb-6">Informações Gerais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-slate-700 text-sm font-semibold">Nome do Produto</span>
                      <input 
                        required
                        className="w-full rounded-lg border border-primary/20 bg-white text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none" 
                        placeholder="Cronógrafo de Luxo 42mm" 
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-slate-700 text-sm font-semibold">SKU</span>
                      <input 
                        required
                        className="w-full rounded-lg border border-primary/20 bg-white text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none" 
                        placeholder="LC-42-GOLD-001" 
                        type="text"
                        value={formData.sku}
                        onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <span className="text-slate-700 text-sm font-semibold">Categoria</span>
                      <select 
                        className="w-full rounded-lg border border-primary/20 bg-white text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none appearance-none"
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option>Relógios</option>
                        <option>Joias</option>
                        <option>Artigos de Couro</option>
                        <option>Acessórios</option>
                        <option>Kits de Presente</option>
                        <option>Perfumaria</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-slate-900 text-lg font-bold leading-tight border-l-4 border-accent-red pl-3 mb-6">Estoque e Preços</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-slate-700 text-sm font-semibold">Preço (BRL)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                        <input 
                          required
                          className="w-full pl-10 rounded-lg border border-primary/20 bg-white text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none" 
                          placeholder="0,00" 
                          type="number"
                          value={formData.price}
                          onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-slate-700 text-sm font-semibold">Custo (BRL)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                        <input 
                          className="w-full pl-10 rounded-lg border border-primary/20 bg-white text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none" 
                          placeholder="0,00" 
                          type="number"
                          value={formData.cost}
                          onChange={e => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-slate-700 text-sm font-semibold">Quantidade em Estoque</span>
                      <input 
                        className="w-full rounded-lg border border-primary/20 bg-white text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 outline-none" 
                        placeholder="0" 
                        type="number"
                        value={formData.stock}
                        onChange={e => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-4 border-t border-primary/10">
                  <button 
                    type="button"
                    onClick={() => { setShowForm(false); onCancel(); }}
                    className="px-8 py-3 rounded-full border border-primary/30 text-slate-700 font-bold hover:bg-primary/5 transition-all flex items-center gap-2"
                  >
                    <X className="size-4" />
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
                  >
                    <Save className="size-5" />
                    {editingProduct ? 'Atualizar Produto' : 'Salvar Produto'}
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-accent-red h-1.5 w-full mt-auto"></div>
          </form>
        ) : (
          <div className="max-w-[1200px] flex-1 bg-white rounded-xl shadow-sm border border-primary/10 overflow-hidden flex flex-col">
            <div className="p-8 border-b border-primary/10 flex justify-between items-center bg-primary/5">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Inventário</h2>
                <p className="text-slate-500">Visualize e gerencie seu catálogo de produtos de luxo</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="bg-slate-100 text-slate-700 px-6 py-3 rounded-full font-bold shadow-sm flex items-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  <CloudUpload className="size-5" />
                  {isSeeding ? 'Importando...' : 'Importar Amostras'}
                </button>
                <button 
                  onClick={handleAddNew}
                  className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-primary/90 transition-all"
                >
                  <CirclePlus className="size-5" />
                  Novo Produto
                </button>
              </div>
            </div>

            <div className="p-6 border-b border-primary/10 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input 
                  type="text"
                  placeholder="Buscar por nome ou SKU..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary/20 outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-4">Produto</th>
                    <th className="px-8 py-4">SKU</th>
                    <th className="px-8 py-4">Categoria</th>
                    <th className="px-8 py-4">Preço</th>
                    <th className="px-8 py-4">Margem</th>
                    <th className="px-8 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filteredProducts.map(product => {
                    const margin = product.cost && product.price 
                      ? ((product.price - product.cost) / product.price * 100).toFixed(1) 
                      : null;
                    
                    return (
                      <tr key={product.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="size-12 rounded-lg overflow-hidden relative border border-primary/10">
                              <Image src={product.image} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="font-bold text-slate-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-slate-500 font-mono text-sm">{product.sku}</td>
                        <td className="px-8 py-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{product.category}</span>
                        </td>
                        <td className="px-8 py-4 font-bold text-slate-900">R$ {product.price.toLocaleString('pt-BR')}</td>
                        <td className="px-8 py-4">
                          {margin ? (
                            <span className={`text-xs font-bold ${Number(margin) > 30 ? 'text-green-600' : 'text-amber-600'}`}>
                              {margin}%
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => onEdit(product)}
                              className="p-2 text-slate-400 hover:text-primary transition-colors"
                            >
                              <Edit3 className="size-5" />
                            </button>
                            <button 
                              onClick={() => onDelete(product.id)}
                              className="p-2 text-slate-400 hover:text-accent-red transition-colors"
                            >
                              <Trash2 className="size-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="px-6 md:px-40 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
        <div className="flex items-center gap-2">
          <Shield className="text-primary size-5" />
          <span>Segurança de nível empresarial ativa</span>
        </div>
        <p>© 2024 Elite ERP Solutions. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <a className="hover:text-primary flex items-center gap-1" href="#"><CircleHelp className="size-4" /> Central de Ajuda</a>
          <a className="hover:text-primary flex items-center gap-1" href="#"><FileCode2 className="size-4" /> Documentação API</a>
        </div>
      </footer>
    </div>
  );
}
