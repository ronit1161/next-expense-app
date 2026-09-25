import { Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

export default function AdminCategoriesTab({
  categories,
  newCatName,
  setNewCatName,
  newCatIcon,
  setNewCatIcon,
  newCatColor,
  setNewCatColor,
  savingCategory,
  categoryMsg,
  categoryError,
  handleCreateCategory,
  handleDeleteCategory,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      {/* Create Category Form */}
      <div className="fintech-card p-6 rounded-3xl space-y-5">
        <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-white/5">
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
              Taxonomy Manager
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Category
            </h3>
          </div>
        </div>

        {categoryMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{categoryMsg}</span>
          </div>
        )}

        {categoryError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{categoryError}</span>
          </div>
        )}

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pet Care, Fitness, Taxes"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Icon Identifier
            </label>
            <select
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition cursor-pointer"
            >
              <option value="Layers" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Layers (General)</option>
              <option value="Utensils" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Utensils / Food</option>
              <option value="Car" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Car / Transport</option>
              <option value="Home" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Home / Rent</option>
              <option value="Zap" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Zap / Bills</option>
              <option value="Film" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Film / Entertainment</option>
              <option value="ShoppingBag" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Shopping Bag</option>
              <option value="Heart" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Heart / Health</option>
              <option value="GraduationCap" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Graduation Cap / Study</option>
              <option value="Plane" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Plane / Travel</option>
              <option value="Gift" className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">Gift</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Color Accent
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-xl border border-slate-200 dark:border-white/10"
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tabular-nums">{newCatColor}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingCategory}
            className="fintech-btn-primary w-full py-2.5 rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            {savingCategory ? 'Creating...' : 'Initialize Category'}
          </button>
        </form>
      </div>

      {/* Existing Categories List */}
      <div className="fintech-card p-6 rounded-3xl md:col-span-2 space-y-5">
        <div className="pb-3.5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
              Active Taxonomy
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Platform Sectors ({categories.length})
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-bold">
            Live Registry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {categories.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: c.color || '#0F766E' }}
                >
                  <CategoryIcon iconName={c.icon} className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.icon}</p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCategory(c.id)}
                title="Delete Category"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
