import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Building2, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Unit, UnitType } from "@/pages/Home";

interface UnitsTabProps {
  units: Unit[];
  addUnit: () => void;
  removeUnit: (id: string) => void;
  updateUnit: (id: string, field: keyof Unit, value: string) => void;
  incompleteUnitIds?: Set<string>;
}

const UNIT_TYPES: UnitType[] = ["مكتب", "معرض", "محل تجاري", "مستودع", "وحدة سكنية", "فندق", "أخرى"];

export default function UnitsTab({ units, addUnit, removeUnit, updateUnit, incompleteUnitIds }: UnitsTabProps) {
  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E2E5E3] pb-4">
        <div>
          <div className="delmon-kicker">فرص التأجير</div>
          <h3 className="mt-1 text-base font-extrabold text-[#262626]">الوحدات الشاغرة ({units.length})</h3>
          <p className="mt-1 text-[11px] text-[#686868]">تُعرض هذه البيانات في بطاقة الوحدة وجداول البروشور التسويقي.</p>
        </div>
        <Button onClick={addUnit} size="sm" className="rounded-md bg-[#949437] px-4 text-white hover:bg-[#7d7e2e]">
          <Plus className="ml-1 h-4 w-4" /> إضافة فرصة
        </Button>
      </div>

      {units.map((unit, idx) => {
        const isReady = Boolean(unit.unitNumber && unit.area && unit.unitType && unit.description);
        const isIncomplete = incompleteUnitIds?.has(unit.id);
        return (
          <article key={unit.id} className="relative overflow-hidden border border-[#E2E5E3] bg-white shadow-[0_8px_22px_rgba(38,38,38,.035)]">
            <div className="absolute bottom-0 right-0 top-0 w-1 bg-[#94B6D2]" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E5E3] bg-[#F7F7F4] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center border border-[#949437]/40 bg-white text-xs font-black text-[#949437]">{String(idx + 1).padStart(2, "0")}</span>
                <div>
                  <div className="text-xs font-extrabold text-[#262626]">فرصة تأجير</div>
                  <div className="text-[10px] text-[#777]">أدخل الحد الأدنى ليظهر العرض بصورة احترافية.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isReady ? (
                  <span className="inline-flex items-center gap-1 border border-[#949437]/25 bg-[#949437]/10 px-2 py-1 text-[10px] font-bold text-[#72732d]"><CheckCircle2 className="h-3 w-3" /> جاهزة للبروشور</span>
                ) : isIncomplete ? (
                  <span className="inline-flex items-center gap-1 border border-[#DD8047]/25 bg-[#DD8047]/10 px-2 py-1 text-[10px] font-bold text-[#b9622e]"><AlertTriangle className="h-3 w-3" /> تحتاج استكمالاً</span>
                ) : null}
                {units.length > 1 && <button type="button" onClick={() => removeUnit(unit.id)} aria-label="حذف الوحدة" className="rounded-md p-1.5 text-[#b9622e] transition-colors hover:bg-[#DD8047]/10"><Trash2 className="h-4 w-4" /></button>}
              </div>
            </div>

            <div className="space-y-4 p-4">
              <section>
                <div className="mb-2 flex items-center gap-2"><span className="delmon-kicker">بيانات العرض</span><span className="h-px flex-1 bg-[#E2E5E3]" /></div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div><Label className="delmon-label mb-1 block">رقم الوحدة <span className="text-[#DD8047]">*</span></Label><Input value={unit.unitNumber} onChange={(e) => updateUnit(unit.id, "unitNumber", e.target.value)} placeholder="مثال: A-101" className="h-9 border-[#E2E5E3] focus-visible:ring-[#94B6D2]" /></div>
                  <div><Label className="delmon-label mb-1 block">الطابق</Label><Input value={unit.floor} onChange={(e) => updateUnit(unit.id, "floor", e.target.value)} placeholder="مثال: الأول" className="h-9 border-[#E2E5E3] focus-visible:ring-[#94B6D2]" /></div>
                  <div><Label className="delmon-label mb-1 block">المساحة (م²) <span className="text-[#DD8047]">*</span></Label><Input value={unit.area} onChange={(e) => updateUnit(unit.id, "area", e.target.value)} placeholder="مثال: 150" inputMode="decimal" className="h-9 border-[#E2E5E3] focus-visible:ring-[#94B6D2]" /></div>
                  <div><Label className="delmon-label mb-1 block">نوع الوحدة <span className="text-[#DD8047]">*</span></Label><Select value={unit.unitType} onValueChange={(v) => updateUnit(unit.id, "unitType", v as UnitType)}><SelectTrigger className="h-9 border-[#E2E5E3] focus:ring-[#94B6D2]"><SelectValue /></SelectTrigger><SelectContent>{UNIT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                </div>
              </section>

              <section>
                <div className="mb-2 flex items-center gap-2"><span className="delmon-kicker">رسالة التسويق</span><span className="h-px flex-1 bg-[#E2E5E3]" /></div>
                <div className="space-y-3">
                  <div><Label className="delmon-label mb-1 block">وصف الوحدة <span className="text-[#DD8047]">*</span></Label><Input value={unit.description} onChange={(e) => updateUnit(unit.id, "description", e.target.value)} placeholder="مثال: معرض بواجهة مباشرة على الممر التجاري الرئيسي" className="h-9 border-[#E2E5E3] focus-visible:ring-[#94B6D2]" /></div>
                  <div><Label className="delmon-label mb-1 block">مميزات الوحدة</Label><Input value={unit.features} onChange={(e) => updateUnit(unit.id, "features", e.target.value)} placeholder="افصل بين المزايا بفاصلة: واجهة زجاجية، مدخل مستقل، تكييف" className="h-9 border-[#E2E5E3] focus-visible:ring-[#94B6D2]" /></div>
                </div>
              </section>

              <section className="border-r-2 border-[#94B6D2] bg-[#edf4fa]/45 p-3">
                <div className="mb-2 text-[10px] font-extrabold text-[#6f96b8]">معلومات التسعير — اختيارية للعرض</div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div><Label className="delmon-label mb-1 block">السعر / م² (ريال)</Label><Input value={unit.pricePerMeter} onChange={(e) => updateUnit(unit.id, "pricePerMeter", e.target.value)} placeholder="مثال: 280" inputMode="decimal" className="h-9 border-[#d6e3ed] bg-white focus-visible:ring-[#94B6D2]" /></div>
                  <div><Label className="delmon-label mb-1 block">الإيجار الشهري (ريال)</Label><Input value={unit.monthlyRent} onChange={(e) => updateUnit(unit.id, "monthlyRent", e.target.value)} placeholder="مثال: 7,000" inputMode="decimal" className="h-9 border-[#d6e3ed] bg-white focus-visible:ring-[#94B6D2]" /></div>
                </div>
              </section>
            </div>
          </article>
        );
      })}

      {units.length === 0 && (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#94B6D2] bg-[#edf4fa]/35 py-10 text-center">
          <Building2 className="mb-2 h-7 w-7 text-[#949437]" />
          <div className="text-sm font-bold text-[#262626]">لا توجد فرص تأجير بعد</div>
          <div className="mt-1 text-xs text-[#747474]">أضف وحدة واحدة على الأقل لبناء بروشور تسويقي.</div>
        </div>
      )}
    </div>
  );
}
