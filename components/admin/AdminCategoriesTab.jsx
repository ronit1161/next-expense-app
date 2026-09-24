import { Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-charcoal flex items-center gap-2 border-b-2 border-black dark:border-white/20 pb-2">
          <Plus className="h-4 w-4 text-[#FF3000]" />
          <span>06.6 INITIALIZE CATEGORY</span>
        </h3>

        {categoryMsg && (
          <div className="p-2.5 border-2 border-black bg-black text-white text-xs font-black uppercase flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#FF3000] shrink-0" />
            <span>{categoryMsg}</span>
          </div>
        )}

        {categoryError && (
          <div className="p-2.5 border-2 border-[#FF3000] bg-[#FF3000]/10 text-[#FF3000] text-xs font-black uppercase flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{categoryError}</span>
          </div>
        )}

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              CATEGORY NAME
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PET CARE, GYM"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="swiss-input w-full px-3 py-2 text-xs font-mono uppercase"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              ICON IDENTIFIER
            </label>
            <select
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="swiss-input w-full px-3 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
            >
              <option value="Layers">LAYERS (DEFAULT)</option>
              <option value="Utensils">UTENSILS / FOOD</option>
              <option value="Car">CAR / TRANSPORT</option>
              <option value="Home">HOME / RENT</option>
              <option value="Zap">ZAP / BILLS</option>
              <option value="Film">FILM / ENTERTAINMENT</option>
              <option value="ShoppingBag">SHOPPING BAG</option>
              <option value="Heart">HEART / HEALTH</option>
              <option value="GraduationCap">GRADUATION CAP</option>
              <option value="Plane">PLANE / TRAVEL</option>
              <option value="Gift">GIFT</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              COLOR ACCENT
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="h-8 w-10 cursor-pointer border-2 border-black"
              />
              <span className="text-xs font-mono text-pencil font-bold uppercase">{newCatColor}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingCategory}
            className="swiss-btn-accent w-full py-2.5 text-xs font-black disabled:opacity-40"
          >
            {savingCategory ? 'INITIALIZING...' : 'CREATE CATEGORY'}
          </button>
        </form>
      </div>

      {/* Existing Categories List */}
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 md:col-span-2 space-y-4">
        <div className="border-b-2 border-black dark:border-white/20 pb-2 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-charcoal">
            GLOBAL PLATFORM SECTORS ({categories.length})
          </h3>
          <span className="text-[10px] font-mono text-pencil uppercase font-bold">ACTIVE REGISTRY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="border-2 border-black dark:border-white/20 p-3 bg-[var(--bg-subtle)] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                  <CategoryIcon iconName={c.icon} className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-charcoal">{c.name}</p>
                  <p className="text-[9px] text-pencil font-mono uppercase">{c.icon}</p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCategory(c.id)}
                title="Delete Category"
                className="p-1 border border-black/20 dark:border-white/20 hover:border-[#FF3000] hover:bg-[#FF3000] hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
