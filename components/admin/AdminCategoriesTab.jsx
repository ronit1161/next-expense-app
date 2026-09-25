import { Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Layers } from 'lucide-react';
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
      <div className="clay-card p-6 sm:p-7 rounded-[32px] space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--clay-border)]">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 clay-orb flex items-center justify-center text-white shrink-0">
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
              Taxonomy Manager
            </span>
            <h3
              className="text-base font-extrabold text-[var(--text-primary)]"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Add New Category
            </h3>
          </div>
        </div>

        {categoryMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{categoryMsg}</span>
          </div>
        )}

        {categoryError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{categoryError}</span>
          </div>
        )}

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pet Care, Fitness, Taxes"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="clay-input w-full px-4 py-3 text-xs font-semibold rounded-2xl"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
              Icon Identifier
            </label>
            <select
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="clay-input w-full px-4 py-3 text-xs font-bold rounded-2xl cursor-pointer"
            >
              <option value="Layers">Layers (General)</option>
              <option value="Utensils">Utensils / Food</option>
              <option value="Car">Car / Transport</option>
              <option value="Home">Home / Rent</option>
              <option value="Zap">Zap / Bills</option>
              <option value="Film">Film / Entertainment</option>
              <option value="ShoppingBag">Shopping Bag</option>
              <option value="Heart">Heart / Health</option>
              <option value="GraduationCap">Graduation Cap / Study</option>
              <option value="Plane">Plane / Travel</option>
              <option value="Gift">Gift</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
              Color Accent
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-xl border border-[var(--clay-border)]"
              />
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">{newCatColor}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingCategory}
            className="clay-btn-primary w-full py-3.5 rounded-2xl text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {savingCategory ? 'Creating...' : 'Initialize Category'}
          </button>
        </form>
      </div>

      {/* Existing Categories List */}
      <div className="clay-card p-6 sm:p-7 rounded-[32px] md:col-span-2 space-y-5">
        <div className="pb-3 border-b border-[var(--clay-border)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
              Active Taxonomy
            </span>
            <h3
              className="text-base font-extrabold text-[var(--text-primary)]"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Platform Sectors ({categories.length})
            </h3>
          </div>
          <span className="clay-badge-pill bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            Live Registry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {categories.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-[var(--bg-muted)] clay-sunken flex items-center justify-between gap-3 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl clay-orb flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: c.color || '#7C3AED' }}
                >
                  <CategoryIcon iconName={c.icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">{c.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{c.icon}</p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCategory(c.id)}
                title="Delete Category"
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
