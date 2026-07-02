import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const C = {
  bg: "#FAF7F1",
  panel: "#FFFFFF",
  ink: "#241C15",
  inkDim: "#8C8172",
  line: "#EAE3D6",
  olive: "#5B7553",
  amber: "#D98E3B",
  clay: "#B5533C",
  navy: "#3B4A5A",
};

const revenueData = [
  { month: "يناير", revenue: 42000, orders: 210 },
  { month: "فبراير", revenue: 38500, orders: 195 },
  { month: "مارس", revenue: 51000, orders: 240 },
  { month: "أبريل", revenue: 47500, orders: 228 },
  { month: "مايو", revenue: 62000, orders: 285 },
  { month: "يونيو", revenue: 58000, orders: 271 },
  { month: "يوليو", revenue: 71500, orders: 312 },
];

const topProducts = [
  { name: "زيت زيتون بكر", sales: 320 },
  { name: "عسل سدر", sales: 275 },
  { name: "تمر صفري", sales: 240 },
  { name: "بخور معطر", sales: 190 },
  { name: "قهوة مختصة", sales: 160 },
];

const channelSplit = [
  { name: "المتجر الإلكتروني", value: 54, color: C.olive },
  { name: "تطبيق الجوال", value: 31, color: C.amber },
  { name: "منصات التواصل", value: 15, color: C.clay },
];

const recentOrders = [
  { id: "#3021", customer: "سارة العتيبي", amount: "412 ر.س", status: "مكتمل" },
  { id: "#3020", customer: "محمد القحطاني", amount: "189 ر.س", status: "قيد الشحن" },
  { id: "#3019", customer: "نورة الدوسري", amount: "760 ر.س", status: "مكتمل" },
  { id: "#3018", customer: "خالد الشمري", amount: "95 ر.س", status: "معلّق" },
  { id: "#3017", customer: "لينا الحربي", amount: "530 ر.س", status: "مكتمل" },
];

const statusColor = { "مكتمل": C.olive, "قيد الشحن": C.amber, "معلّق": C.clay };

function KpiCard({ label, value, delta, positive }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
      <p className="text-xs mb-2" style={{ color: C.inkDim }}>{label}</p>
      <p className="text-2xl font-black" style={{ color: C.ink }}>{value}</p>
      <p className="text-xs mt-1 font-bold" style={{ color: positive ? C.olive : C.clay }}>
        {positive ? "▲" : "▼"} {delta}
      </p>
    </div>
  );
}

export default function StoreDashboard() {
  const [range, setRange] = useState("7 أشهر");

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full flex"
      style={{ background: C.bg, fontFamily: "'Cairo', 'Tajawal', sans-serif", color: C.ink }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;900&family=Tajawal:wght@400;500;700&display=swap');
      `}</style>

      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 p-6 shrink-0"
        style={{ background: C.panel, borderLeft: `1px solid ${C.line}` }}
      >
        <div className="mb-8">
          <p className="text-xl font-black" style={{ color: C.olive }}>نخيل</p>
          <p className="text-[11px]" style={{ color: C.inkDim }}>متجر منتجات محلية</p>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {["نظرة عامة", "الطلبات", "المنتجات", "العملاء", "التقارير", "الإعدادات"].map((item, i) => (
            <div
              key={item}
              className="px-3 py-2 rounded-lg"
              style={{
                background: i === 0 ? "#F1EBDD" : "transparent",
                color: i === 0 ? C.olive : C.inkDim,
                fontWeight: i === 0 ? 700 : 400,
              }}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black">نظرة عامة على الأداء</h1>
            <p className="text-sm" style={{ color: C.inkDim }}>ملخص المبيعات آخر {range}</p>
          </div>
          <div className="flex gap-2">
            {["7 أشهر", "30 يوم", "سنة"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: range === r ? C.olive : C.panel,
                  color: range === r ? "#fff" : C.inkDim,
                  border: `1px solid ${range === r ? C.olive : C.line}`,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard label="إجمالي الإيرادات" value="371,500 ر.س" delta="12.4%" positive />
          <KpiCard label="عدد الطلبات" value="1,741" delta="8.1%" positive />
          <KpiCard label="متوسط قيمة الطلب" value="213 ر.س" delta="2.3%" positive />
          <KpiCard label="معدل الإرجاع" value="1.8%" delta="0.4%" positive={false} />
        </div>

        {/* Charts row */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 rounded-2xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
            <p className="text-sm font-bold mb-4">نمو الإيرادات الشهري</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <CartesianGrid stroke={C.line} vertical={false} />
                <XAxis dataKey="month" stroke={C.inkDim} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={C.inkDim} fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: "Tajawal" }} />
                <Line type="monotone" dataKey="revenue" stroke={C.olive} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
            <p className="text-sm font-bold mb-4">قنوات البيع</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={channelSplit} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {channelSplit.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: "Tajawal" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {channelSplit.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span style={{ color: C.inkDim }}>{c.name}</span>
                  <span className="font-bold mr-auto">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
            <p className="text-sm font-bold mb-4">المنتجات الأعلى مبيعاً</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical" margin={{ right: 20 }}>
                <CartesianGrid stroke={C.line} horizontal={false} />
                <XAxis type="number" stroke={C.inkDim} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke={C.inkDim} fontSize={11} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.line}`, fontFamily: "Tajawal" }} />
                <Bar dataKey="sales" fill={C.amber} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl p-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
            <p className="text-sm font-bold mb-4">أحدث الطلبات</p>
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-4 text-[11px] pb-2" style={{ color: C.inkDim, borderBottom: `1px solid ${C.line}` }}>
                <span>الطلب</span><span>العميل</span><span>المبلغ</span><span>الحالة</span>
              </div>
              {recentOrders.map((o) => (
                <div key={o.id} className="grid grid-cols-4 text-sm py-2.5 items-center" style={{ borderBottom: `1px solid ${C.line}` }}>
                  <span className="font-bold">{o.id}</span>
                  <span style={{ color: C.inkDim }}>{o.customer}</span>
                  <span>{o.amount}</span>
                  <span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ background: `${statusColor[o.status]}1A`, color: statusColor[o.status] }}
                    >
                      {o.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
