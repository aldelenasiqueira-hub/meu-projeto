'use client';

import React, { useState, useEffect, useCallback } from 'react';
import POSView from '@/components/POSView';
import ERPView from '@/components/ERPView';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Cronógrafo de Ouro Clássico', price: 1250, sku: 'CH-001', category: 'Relógios', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALB70gp3YRQyi5G_mNSAXDMeF77trJHPZxAQywI0ZKiIeVwn5C57WYwtT-h6dbBoOuItD7eeo9ZvtIQR6JsP88-PMHnIoZGC15gUfoLcbQrrN6jSt5l0ccR8WtQY82KiIv019g1QBm4tJEVsby38TSJIo0jTPC10Ug1zgLIOd1dXnq_64r_hY_GfWTLW1wjTZjpVh7fLFKA1Dr4Vs07c2vG7U_4W_fOmwo-4HO30ohmjRSVJi_2BD8c6IeKhmSndnf1rxT3rVdlBj5', badge: 'LIMITADO' },
  { id: 2, name: 'Pasta Artesanal', price: 420, sku: 'LB-92', category: 'Artigos de Couro', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiKIsWCe4VYpEsM21xTz73FPC4mt1-WWgMMRX8f--weXz5oIxaaCyiS-m6ZrUVUfv0eAZz-qpBRzgEyzgGNCy4FN-nD41PpStRHSHvuTpIHNYlTB6wYToax_k4nKcpVQEypGYXmAHj-_i8fVRGLE8rekTRGxCIPJJ8GHikd6Nl9mT2GIKFjvY-CW5Qr6zF6sDM5zAPuryBM66Xq-zxkh4OHmQJgetAO-19D6utnrY9VhqGz7Fe-GY2xvdcqztJzXuT2Mmf5rMFG6wE' },
  { id: 3, name: 'Aliança de Diamante 18k', price: 2100, sku: 'JR-22', category: 'Joias', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOhYa3sFzbviF8NTxmS9ee7b3NUMd-PVq0SQB6xhjuQdx4jxoh9kEP7im6JYwoSZD3dOUI0a0BNB7jUFH5v_U-_GNHa1CBCXpFDAzLlC0OjahfMEjCRlJ19Vfrl7brz-4CUPKL6OfvdUAn35ss-U63ew9TqHe2DIZpd0BDDXdODJDh295RONVLXPbUYePYhDfb3T1HvVoyDwFUdKMFK76Bg69RJPn_EWNYAPt1_VsV8n2l6nsa_sTVFhLfZnPJ9-XuflfGmrby3Nac', badge: 'DESTAQUE' },
  { id: 4, name: 'Gravata Executiva de Seda', price: 95, sku: 'AC-05', category: 'Acessórios', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtnyDRMX43WYrRzHll-yftGzojWQ7YO4BZOfGYkY4iRL2SAJaQAggXl3DeECKpYdIeGqMy_sCSG-U9Us7JIoMWHNGUsqDbNrAt0L3pbPYI_n_fW-Ei59B3sgZ9D1ldG_0u40TlvWBX3xzTC8Shhmf2skZidT8ROPm2xjqEXjUmgOrRvihQ1XnqIGeLaX_K8TWoImJ3e35JvfqWLybu4w8qbbpcUr16gv7t1heuq5O5dZTgv4JJe72Babrzs5k3wskAuhz7GHr8oUuf' },
  { id: 5, name: 'Caneta Tinteiro Sovereign', price: 180, sku: 'AC-12', category: 'Acessórios', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqx_qrBSFyXWwwwYFtrrTaStY7Y0bPcu6HdNgrpKth4C6vQxUfEAAfpgy-fLR6NP5lrOhbGb3hvajPdOV0IyuZ1srkD9MOa09gowp6DT26OTLSHp-m6HxLADc6QghIzldGpLpWkBn6V4P831T92LwGAnRNFHzK7e_lDTzKlzEB9kVVh8NpFVT4L3Qd7Zxut9e_YkGcFRDmv2YauB-oVFMKZm050OZX701M9wbk7BglA8VDtQMEUij9jfMk3r6uC7iarSzqi_-yMDz6' },
  { id: 6, name: 'Carteira de Couro Bifold', price: 115, sku: 'LB-10', category: 'Artigos de Couro', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR9oWBRWLJ20FzoxEMeYJMXnBrRFxtPXmxiVV1sab28s_pX0q8J9DWrkWHEqIWvGH7KF2PU0PalXvAqHdgkYc6IOuxn4gaUwFjdsXZ3ZJ2MIPK-dy4U2D_LOLGWY9TH0ruydejrX5UH9wqGoRqdmWpcV9SushbqmUCdbU0cYP2S1FfSYcef1yLyXAExVB1xrjSrfdSX8CJ466FFRad72XGd-dtqE2BiDr8WTNzVhFEGkHlvKkXBfAmiJHEwuS2ynn1eni5DUACSDhi' },
  { id: 7, name: 'Conjunto de Decanter de Cristal', price: 340, sku: 'GS-08', category: 'Kits de Presente', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHr057BOuUCb9mudekcT0G-j1GCQpnt9lF5xJi6W_Js8cFuf12de2ZU6Dj0uyrVgZvO2zKoyWgNfXmHEJz9vlhW5S1-B2xK7Zj7NtnSFV4IH2ECCschGjIVppoAwxDMqdXGpd3s0m4P0tSct4hqxGg5bcU_qQG5ryA0UJJh0mkhPt0gA9ZgU81nhdEXMdPC-DENOvdyx1iuLL8-LKKKpUqRmDeIe6L-6vodrpZpfalSakS5l__lzRoMAknuBvF2xsDf7LXBQtGpyvt' },
  { id: 8, name: 'Cachecol de Cashmere', price: 220, sku: 'AC-22', category: 'Acessórios', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwHwRUnb1mBIrp1Xnbsr9UXyx_owZ0zZP6ilWh75J-Ug3WXWJUBmeFOyqtwIpV769-P72unI_0i1pm0HG9TFFwvHGA-pdWLgv07a2DvT3veLTN_1Zzer5KRyFJrOzBPU0kGJ72MLWvTtktQS4qe9dqtR_REw9F3x_mrdHOJb1-yH0_lu9wzRViTfNyplfNW4jBTC6XM1FVs2RrVWtujyj5aF28naUBurcMz7SKH5lP9_5TlxBETjE_LpCb4a0cINAQfxcmWvraoU31' },
  { id: 9, name: 'Óculos de Sol Aviador', price: 290, sku: 'AC-45', category: 'Acessórios', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800', cost: 120, stock: 15 },
  { id: 10, name: 'Perfume Signature Edition', price: 450, sku: 'PF-01', category: 'Acessórios', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800', cost: 180, stock: 25 },
  { id: 11, name: 'Cinto de Couro Nobre', price: 150, sku: 'LB-15', category: 'Artigos de Couro', image: 'https://images.unsplash.com/photo-1624222247344-550fbad89840?auto=format&fit=crop&q=80&w=800', cost: 60, stock: 40 },
  { id: 12, name: 'Bolsa de Ombro Elegance', price: 850, sku: 'LB-22', category: 'Artigos de Couro', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', cost: 320, stock: 12 },
  { id: 13, name: 'Relógio de Parede Minimalista', price: 180, sku: 'AC-33', category: 'Acessórios', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=800', cost: 75, stock: 20 },
  { id: 14, name: 'Relógio de Mergulho Profissional', price: 3200, sku: 'DW-01', category: 'Relógios', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800', cost: 1400, stock: 5 },
];

export type Product = {
  id: number;
  name: string;
  price: number;
  sku: string;
  category: string;
  image: string;
  badge?: string;
  cost?: number;
  stock?: number;
};

export default function Page() {
  const [view, setView] = useState<'pos' | 'erp'>('pos');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const seedInitialProducts = useCallback(async () => {
    const { error } = await supabase
      .from('products')
      .upsert(
        INITIAL_PRODUCTS.map(({ id, ...p }) => p),
        { onConflict: 'sku' }
      );
    if (error) console.error('Error seeding products:', error.message, error.code, error.details);
  }, []);

  useEffect(() => {
    // Check if Supabase is configured
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder-url.supabase.co';
    
    if (!isConfigured) {
      console.error('Supabase não está configurado. Verifique as variáveis de ambiente.');
      setProducts(INITIAL_PRODUCTS);
      setLoading(false);
      return;
    }

    let ignore = false;
    
    const load = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (ignore) return;

      if (error) {
        if (String(error.message).includes('relation "products" does not exist')) {
          console.error('A tabela "products" não existe no seu Supabase. Por favor, execute a migração SQL.');
          alert('Erro crítico: A tabela de produtos não foi encontrada no banco de dados. Verifique a configuração do Supabase.');
        } else {
          console.error('Error fetching products:', error.message, error.code, error.details);
        }
        setProducts(INITIAL_PRODUCTS);
        setLoading(false);
      } else if (data && data.length > 0) {
        setProducts(data);
        setLoading(false);
      } else {
        await seedInitialProducts();
        const { data: seededData } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });
        if (!ignore) {
          setProducts(seededData || INITIAL_PRODUCTS);
          setLoading(false);
        }
      }
    };

    load();
    return () => { ignore = true; };
  }, [refreshTrigger, seedInitialProducts]);

  const handleSaveProduct = async (productData: Omit<Product, 'id'> & { id?: number }) => {
    try {
      // Basic validation
      if (!productData.name || !productData.sku || !productData.price) {
        alert('Por favor, preencha nome, SKU e preço.');
        return;
      }

      // Whitelist data to save to avoid extra fields that might cause Supabase errors
      const dataToSave = {
        name: productData.name,
        sku: productData.sku,
        category: productData.category,
        price: productData.price,
        image: productData.image,
        cost: productData.cost,
        stock: productData.stock,
        badge: productData.badge
      };
      
      const id = productData.id;
      
      if (id) {
        let { error } = await supabase
          .from('products')
          .update(dataToSave)
          .eq('id', id);
        
        // Fallback if columns don't exist in the database yet
        if (error && (String(error.message).includes('column') || String(error.code).startsWith('42'))) {
          console.warn('Fallback: Possible schema mismatch, trying with minimal fields');
          const minimalData = {
            name: dataToSave.name,
            sku: dataToSave.sku,
            category: dataToSave.category,
            price: dataToSave.price,
            image: dataToSave.image
          };
          const retry = await supabase
            .from('products')
            .update(minimalData)
            .eq('id', id);
          error = retry.error;
        }
        
        if (error) {
          console.error('Error updating product:', error.message, error.code, error.details);
          const errorMsg = error.message || 'Erro desconhecido';
          const errorDetails = error.details ? ` (${error.details})` : '';
          alert(`Erro ao atualizar produto: ${errorMsg}${errorDetails}`);
          return;
        }
      } else {
        let { error } = await supabase
          .from('products')
          .insert([dataToSave]);
        
        // Fallback if columns don't exist in the database yet
        if (error && (String(error.message).includes('column') || String(error.code).startsWith('42'))) {
          console.warn('Fallback: Possible schema mismatch, trying with minimal fields');
          const minimalData = {
            name: dataToSave.name,
            sku: dataToSave.sku,
            category: dataToSave.category,
            price: dataToSave.price,
            image: dataToSave.image
          };
          const retry = await supabase
            .from('products')
            .insert([minimalData]);
          error = retry.error;
        }
        
        if (error) {
          console.error('Error creating product:', error.message, error.code, error.details);
          let errorMsg = error.message || 'Erro desconhecido';
          
          if (error.code === '23505') {
            errorMsg = 'Este SKU já está em uso por outro produto.';
          }
          
          const errorDetails = error.details ? ` (${error.details})` : '';
          alert(`Erro ao criar produto: ${errorMsg}${errorDetails}`);
          return;
        }
      }
      
      setLoading(true);
      setRefreshTrigger(prev => prev + 1);
      setEditingProduct(null);
      setView('pos');
    } catch (err) {
      console.error('Unexpected error saving product:', err);
      alert('Ocorreu um erro inesperado ao salvar o produto.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        alert('Erro ao excluir produto');
      } else {
        setLoading(true);
        setRefreshTrigger(prev => prev + 1);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setView('erp');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setView('pos');
  };

  const handleFinishSale = async (items: (Product & { quantity: number })[]) => {
    try {
      // Update stock for each item
      for (const item of items) {
        if (item.stock !== undefined) {
          const newStock = Math.max(0, item.stock - item.quantity);
          const { error } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.id);
          
          if (error) throw error;
        }
      }
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error finishing sale:', error);
      alert('Erro ao processar venda no estoque');
      return false;
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-light">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-bold animate-pulse">Carregando Luxe POS...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      {/* View Switcher Overlay (Floating) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md border border-primary/20 rounded-full p-1 shadow-2xl flex gap-1">
        <button 
          onClick={() => { setView('pos'); setEditingProduct(null); }}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${view === 'pos' ? 'bg-primary text-white shadow-lg' : 'text-slate-600 hover:bg-primary/10'}`}
        >
          Luxe PDV
        </button>
        <button 
          onClick={() => setView('erp')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${view === 'erp' ? 'bg-primary text-white shadow-lg' : 'text-slate-600 hover:bg-primary/10'}`}
        >
          Elite ERP
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'pos' ? (
          <motion.div
            key="pos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <POSView 
              products={products} 
              onDelete={handleDeleteProduct} 
              onEdit={handleEditProduct}
              onAddNew={() => { setEditingProduct(null); setView('erp'); }}
              onFinishSale={handleFinishSale}
            />
          </motion.div>
        ) : (
          <motion.div
            key="erp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ERPView 
              products={products}
              onSave={handleSaveProduct} 
              onDelete={handleDeleteProduct}
              onEdit={handleEditProduct}
              onSeed={async () => {
                await seedInitialProducts();
                setRefreshTrigger(prev => prev + 1);
              }}
              editingProduct={editingProduct}
              onCancel={handleCancelEdit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
