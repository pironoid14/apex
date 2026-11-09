import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  TrendingUp,
  Download,
  RotateCcw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, FormFactor } from '../../types';

export const InventoryManager: React.FC = () => {
  const { products, updateStock, adjustStock, updateProduct, addProduct, deleteProduct } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'ApexRig',
    category: 'gaming' as ProductCategory,
    price: 2999,
    stock: 10,
    cpu: 'Intel Core i9-14900K',
    gpu: 'NVIDIA RTX 4080 Super 16GB',
    ram: 64,
    storage: '2TB Gen4 NVMe SSD',
    formFactor: 'Mid Tower' as FormFactor,
    cooling: '360mm Liquid AIO',
    powerSupply: '850W 80+ Gold ATX 3.0',
    description: 'Custom engineered high-performance system.'
  });

  // Calculate inventory metrics
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const inventoryValuation = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  const handleSavePrice = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod && tempPrice > 0) {
      updateProduct({ ...prod, price: tempPrice });
    }
    setEditingPriceId(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Stock', 'Price', 'CPU', 'GPU', 'Valuation'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.stock,
      p.price,
      `"${p.specs.cpu}"`,
      `"${p.specs.gpu}"`,
      p.stock * p.price
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apexrig_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    const product: Product = {
      id: `pc-${Math.random().toString(36).substring(2, 8)}`,
      name: newProduct.name,
      tagline: 'Engineered Precision Performance',
      category: newProduct.category,
      brand: newProduct.brand,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.price) + 200,
      rating: 5.0,
      reviewsCount: 1,
      image: '/src/assets/images/product_studio_workstation_1794212402879.jpg',
      specs: {
        cpu: newProduct.cpu,
        gpu: newProduct.gpu,
        ram: Number(newProduct.ram),
        storage: newProduct.storage,
        formFactor: newProduct.formFactor,
        cooling: newProduct.cooling,
        powerSupply: newProduct.powerSupply
      },
      benchmarks: {
        cyberpunkFps4k: 85,
        cinebenchR23: 32000
      },
      stock: Number(newProduct.stock),
      status: Number(newProduct.stock) > 3 ? 'in_stock' : Number(newProduct.stock) > 0 ? 'low_stock' : 'out_of_stock',
      featured: false,
      description: newProduct.description,
      warranty: '3-Year On-Site Support',
      includedAccessories: ['Power Cable', 'Accessories Kit']
    };

    addProduct(product);
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      brand: 'ApexRig',
      category: 'gaming',
      price: 2999,
      stock: 10,
      cpu: 'Intel Core i9-14900K',
      gpu: 'NVIDIA RTX 4080 Super 16GB',
      ram: 64,
      storage: '2TB Gen4 NVMe SSD',
      formFactor: 'Mid Tower',
      cooling: '360mm Liquid AIO',
      powerSupply: '850W 80+ Gold ATX 3.0',
      description: 'Custom engineered high-performance system.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <div className="text-xs text-neutral-400 font-medium">Total Units in Stock</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {totalUnits}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">Across {products.length} models</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <div className="text-xs text-neutral-400 font-medium">Warehouse Inventory Valuation</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
            ${inventoryValuation.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">Wholesale asset value</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <div className="text-xs text-neutral-400 font-medium">Low Stock Warnings (≤ 3)</div>
          <div className="text-2xl font-bold font-mono text-amber-500 tabular-nums mt-1">
            {lowStockCount}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">Requires re-order allocation</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <div className="text-xs text-neutral-400 font-medium">Depleted / Backordered</div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums mt-1">
            {outOfStockCount}
          </div>
          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">0 units available</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Warehouse Inventory Matrix</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time stock allocations decrement immediately upon checkout authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Computer Model</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800 font-mono">
              <tr>
                <th className="px-4 py-3 font-medium">Model & Specifications</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Unit Price</th>
                <th className="px-4 py-3 font-medium">Live Stock</th>
                <th className="px-4 py-3 font-medium">Inventory Value</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {products.map((product) => {
                const isEditingPrice = editingPriceId === product.id;
                return (
                  <tr key={product.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Model Details */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate max-w-xs">{product.name}</div>
                          <div className="text-[11px] text-neutral-400 font-mono truncate max-w-xs">
                            {product.specs.cpu.split('(')[0]} · {product.specs.gpu}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-neutral-300 uppercase text-[11px]">
                        {product.category}
                      </span>
                    </td>

                    {/* Unit Price */}
                    <td className="px-4 py-3 font-mono">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 bg-neutral-950 border border-amber-400 rounded text-white text-xs font-mono"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(product.id)}
                            className="px-2 py-1 bg-amber-400 text-neutral-950 font-bold rounded text-[10px]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 group/price">
                          <span className="text-white font-semibold tabular-nums">
                            ${product.price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(product.id);
                              setTempPrice(product.price);
                            }}
                            className="opacity-0 group-hover/price:opacity-100 text-neutral-500 hover:text-amber-400 transition-opacity p-0.5"
                            title="Edit price"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Stock Management with Quick Steppers */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-neutral-800 rounded bg-neutral-950">
                          <button
                            onClick={() => adjustStock(product.id, -1)}
                            disabled={product.stock <= 0}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            -
                          </button>
                          <span
                            className={`px-2 font-mono font-bold tabular-nums ${
                              product.stock <= 0
                                ? 'text-rose-400'
                                : product.stock <= 3
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {product.stock}
                          </span>
                          <button
                            onClick={() => adjustStock(product.id, 1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {product.stock <= 3 && product.stock > 0 && (
                          <span className="text-[10px] text-amber-400 font-mono">Low</span>
                        )}
                        {product.stock <= 0 && (
                          <span className="text-[10px] text-rose-400 font-mono">Zero</span>
                        )}
                      </div>
                    </td>

                    {/* Valuation */}
                    <td className="px-4 py-3 font-mono text-neutral-300 tabular-nums">
                      ${(product.stock * product.price).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => adjustStock(product.id, 5)}
                          className="px-2 py-1 text-[11px] font-mono rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                          title="Restock 5 units"
                        >
                          +5 Restock
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Discontinue model"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add New Computer Model Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white">Add New Computer Configuration</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex CyberStation 7900"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="gaming">Gaming</option>
                    <option value="workstation">Workstation</option>
                    <option value="mini-itx">Mini-ITX</option>
                    <option value="laptop">Laptop</option>
                    <option value="server">Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    min="100"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Processor (CPU)</label>
                  <input
                    type="text"
                    value={newProduct.cpu}
                    onChange={(e) => setNewProduct({ ...newProduct, cpu: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Graphics (GPU)</label>
                  <input
                    type="text"
                    value={newProduct.gpu}
                    onChange={(e) => setNewProduct({ ...newProduct, gpu: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">RAM Capacity (GB)</label>
                  <input
                    type="number"
                    value={newProduct.ram}
                    onChange={(e) => setNewProduct({ ...newProduct, ram: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Solid State Storage</label>
                  <input
                    type="text"
                    value={newProduct.storage}
                    onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Create Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
