import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const C = {
  bg: "#F5F7FA",
  panel: "#FFFFFF",
  ink: "#1B2430",
  inkDim: "#7C8798",
  line: "#E4E8EE",
  teal: "#2B7A78",
  coral: "#E0685A",
  gold: "#DDA448",
  indigo: "#4C5C96",
  sage: "#6F9C7D",
};

const CATEGORIES = [
  { name: "طعام", color: C.coral },
  { name: "مواصلات", color: C.gold },
  { name: "سكن", color: C.indigo },
  { name: "ترفيه", color: C.sage },
  { name: "أخرى", color: C.teal },
];

const seedExpenses = [
  { id: 1, title: "بقالة الأسبوع", amount: 210, category: "طعام", date: "2026-07-01" },
  { id: 2, title: "وقود السيارة", amount: 120, category: "مواصلات", date: "2026-06-29" },
  { id: 3, title: "فاتورة الإيجار", amount: 1800, category: "سكن", date: "2026-06-28" },
  { id: 4, title: "اشتراك ستريمنج", amount: 39, category: "ترفيه", date: "2026-06-27" },
  { id: 5, title: "عشاء مع الأصدقاء", amount: 95, category: "طعام", date: "2026-06-25" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState(seedExpenses);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [monthlyLimit] = useState(3000);

  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const byCategory = useMemo(() => {
    return CATEGORIES.map((c) => ({
      name: c.name,
      color: c.color,
      value: expenses.filter((e) => e.category === c.name).reduce((s, e) => s + e.amount, 0),
    })).filter((c) => c.value > 0);
  }, [expenses]);

  const remaining = monthlyLimit - total;
  const pct = Math.min(100, Math.round((total / monthlyLimit) * 100));

  const addExpense = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!title.trim() || !amt || amt <= 0) return;
    setExpenses((prev) => [
      { id: Date.now(), title: title.trim(), amount: amt, category, date: todayISO() },
      ...prev,
    ]);
    setTitle("");
    setAmount("");
  };

  const removeExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full py-10 px-4"
      style={{ background: C.bg, fontFamily: "'Tajawal', sans-serif", color: C.ink }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');`}</style>

      <div className="max-w-4xl mx-auto">
        <header className="mb-7">
          <p className="text-xs tracking-[0.3em] mb-1" style={{ color: C.teal }}>تتبع الميزانية</p>
          <h1 className="text-2xl md:text-3xl font-black">متتبع المصاريف الشهري</h1>
        </header>

        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {/* Budget summary */}
          <div className="md:col-span-2 rounded-2xl p-6" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-xs" style={{ color: C.inkDim }}>إجمالي الصرف هذا الشهر</p>
                <p className="text-3xl font-black">{total.toLocaleString()} ر.س</p>
              </div>
              <div className="text-left">
                <p className="text-xs" style={{ color: C.inkDim }}>الميزانية</p>
                <p className="text-lg font-bold" style={{ color: C.inkDim }}>{monthlyLimit.toLocaleString()} ر.س</p>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: C.line }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: pct > 90 ? C.coral : C.teal,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: remaining < 0 ? C.coral : C.inkDim }}>
              {remaining >= 0
                ? `متبقٍ ${remaining.toLocaleString()} ر.س من ميزانيتك`
                : `تجاوزت الميزانية بمقدار ${Math.abs(remaining).toLocaleString()} ر.س`}
            </p>
          </div>

          {/* Category breakdown */}
          <div className="rounded-2xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
            <p className="text-xs font-bold mb-2" style={{ color: C.inkDim }}>حسب الفئة</p>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={32} outerRadius={55} paddingAngle={3}>
                  {byCategory.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: "Tajawal" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {byCategory.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-[11px]" style={{ color: C.inkDim }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add expense form */}
        <form
          onSubmit={addExpense}
          className="rounded-2xl p-5 mb-6 flex flex-wrap gap-3 items-end"
          style={{ background: C.panel, border: `1px solid ${C.line}` }}
        >
          <div className="flex-1 min-w-[160px]">
            <label className="text-[11px]" style={{ color: C.inkDim }}>الوصف</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: عشاء، فاتورة كهرباء"
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: `1px solid ${C.line}` }}
            />
          </div>
          <div className="w-28">
            <label className="text-[11px]" style={{ color: C.inkDim }}>المبلغ</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
              placeholder="0"
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: `1px solid ${C.line}` }}
            />
          </div>
          <div className="w-36">
            <label className="text-[11px]" style={{ color: C.inkDim }}>الفئة</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: `1px solid ${C.line}` }}
            >
              {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-sm font-bold"
            style={{ background: C.teal, color: "#fff" }}
          >
            إضافة
          </button>
        </form>

        {/* Expense list */}
        <div className="rounded-2xl overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
          <div className="grid grid-cols-12 text-[11px] px-5 py-3" style={{ color: C.inkDim, borderBottom: `1px solid ${C.line}` }}>
            <span className="col-span-5">الوصف</span>
            <span className="col-span-3">الفئة</span>
            <span className="col-span-2">التاريخ</span>
            <span className="col-span-2 text-left">المبلغ</span>
          </div>
          {expenses.length === 0 && (
            <p className="text-center text-sm py-10" style={{ color: C.inkDim }}>لا توجد مصاريف مسجّلة بعد</p>
          )}
          {expenses.map((e) => {
            const cat = CATEGORIES.find((c) => c.name === e.category);
            return (
              <div
                key={e.id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm group"
                style={{ borderBottom: `1px solid ${C.line}` }}
              >
                <span className="col-span-5 font-medium">{e.title}</span>
                <span className="col-span-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                    style={{ background: `${cat?.color}1A`, color: cat?.color }}
                  >
                    {e.category}
                  </span>
                </span>
                <span className="col-span-2 text-xs" style={{ color: C.inkDim }}>{e.date}</span>
                <span className="col-span-2 flex items-center justify-between">
                  <span className="font-bold">{e.amount.toLocaleString()} ر.س</span>
                  <button
                    onClick={() => removeExpense(e.id)}
                    aria-label="حذف"
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: C.coral }}
                  >
                    حذف
                  </button>
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] mt-3 text-center" style={{ color: C.inkDim }}>
          ملاحظة: البيانات تُحفظ في الجلسة الحالية فقط ولا تُخزَّن بشكل دائم في هذه المعاينة.
        </p>
      </div>
    </div>
  );
}
