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
      <div className="neu-card p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
          <Plus className="h-4 w-4 text-[#0047FF]" />
          <span>Add Custom Category</span>
        </h3>

        {categoryMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{categoryMsg}</span>
          </div>
        )}

        {categoryError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{categoryError}</span>
          </div>
        )}

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-pencil uppercase">Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Pet Care, Gaming, Gym"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="neu-input w-full px-3 py-2 text-xs text-charcoal rounded-xl mt-1"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-pencil uppercase">Icon Identifier</label>
            <select
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="neu-input w-full px-3 py-2 text-xs text-charcoal rounded-xl mt-1"
            >
              <option value="Layers">Layers (Default)</option>
              <option value="Utensils">Utensils / Food</option>
              <option value="Car">Car / Transport</option>
              <option value="Home">Home / Rent</option>
              <option value="Zap">Zap / Bills</option>
              <option value="Film">Film / Entertainment</option>
              <option value="ShoppingBag">Shopping Bag</option>
              <option value="Heart">Heart / Health</option>
              <option value="GraduationCap">Graduation Cap</option>
              <option value="Plane">Plane / Travel</option>
              <option value="Gift">Gift</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-pencil uppercase">Color Swatch</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
              />
              <span className="text-xs font-mono text-pencil">{newCatColor}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingCategory}
            className="neu-btn-blue w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {savingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>{savingCategory ? 'Creating...' : 'Create Category'}</span>
          </button>
        </form>
      </div>

      {/* Existing Categories List */}
      <div className="neu-card p-6 rounded-2xl md:col-span-2 space-y-4">
        <h3 className="text-sm font-bold text-charcoal">
          Global Platform Categories ({categories.length})
        </h3>
        <p className="text-xs text-pencil">
          These categories are available to all users across expense tracking and budgeting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="neu-inset p-3 rounded-xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: c.color || '#0047FF' }}
                >
                  <CategoryIcon name={c.icon} className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal">{c.name}</p>
                  <p className="text-[10px] text-pencil uppercase font-mono">{c.color}</p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCategory(c.id)}
                title="Delete Category"
                className="p-1.5 text-pencil hover:text-loss transition-colors rounded-lg neu-btn-sm cursor-pointer"
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
