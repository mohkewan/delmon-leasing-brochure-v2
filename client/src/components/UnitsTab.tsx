import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Unit, UnitType, ProjectData } from "@/pages/Home";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#2C2C2C]">الوحدات الشاغرة ({units.length})</h3>
        <Button
          onClick={addUnit}
          size="sm"
          className="bg-[#949437] hover:bg-[#7a7a2e] text-white"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة وحدة
        </Button>
      </div>
      {units.map((unit, idx) => (
        <div
          key={unit.id}
          className="border border-[#D0D0D0] rounded-xl p-4 bg-[#F8F9FD] relative"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#2C2C2C] bg-[#949437]/10 px-3 py-1 rounded-full">
                وحدة {idx + 1}
              </span>
              {incompleteUnitIds?.has(unit.id) && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  بيانات ناقصة
                </span>
              )}
            </div>
            {units.length > 1 && (
              <button
                onClick={() => removeUnit(unit.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">رقم الوحدة</Label>
              <Input
                value={unit.unitNumber}
                onChange={(e) => updateUnit(unit.id, "unitNumber", e.target.value)}
                placeholder="مثال: A-101"
                className="h-8 text-sm border-[#D0D0D0]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">الطابق</Label>
              <Input
                value={unit.floor}
                onChange={(e) => updateUnit(unit.id, "floor", e.target.value)}
                placeholder="مثال: الأول"
                className="h-8 text-sm border-[#D0D0D0]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">المساحة (م²)</Label>
              <Input
                value={unit.area}
                onChange={(e) => updateUnit(unit.id, "area", e.target.value)}
                placeholder="مثال: 150"
                className="h-8 text-sm border-[#D0D0D0]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">نوع الوحدة</Label>
              <Select value={unit.unitType} onValueChange={(v) => updateUnit(unit.id, "unitType", v as UnitType)}>
                <SelectTrigger className="h-8 text-sm border-[#D0D0D0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">السعر/م² (ريال)</Label>
              <Input
                value={unit.pricePerMeter}
                onChange={(e) => updateUnit(unit.id, "pricePerMeter", e.target.value)}
                placeholder="مثال: 280"
                className="h-8 text-sm border-[#D0D0D0]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">الإيجار الشهري (ريال)</Label>
              <Input
                value={unit.monthlyRent}
                onChange={(e) => updateUnit(unit.id, "monthlyRent", e.target.value)}
                placeholder="مثال: 7,000"
                className="h-8 text-sm border-[#D0D0D0]"
              />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">وصف الوحدة</Label>
              <Input
                value={unit.description}
                onChange={(e) => updateUnit(unit.id, "description", e.target.value)}
                placeholder="مثال: مكتب مفتوح بإطلالة على الشارع الرئيسي"
                className="h-8 text-sm border-[#D0D0D0]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">مميزات الوحدة</Label>
              <Input
                value={unit.features}
                onChange={(e) => updateUnit(unit.id, "features", e.target.value)}
                placeholder="مثال: تكييف، إنترنت، مدخل مستقل"
                className="h-8 text-sm border-[#D0D0D0]"
              />
            </div>
          </div>
        </div>
      ))}
      {units.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">🏢</div>
          <div className="text-sm">لا توجد وحدات بعد. انقر على "إضافة وحدة" للبدء.</div>
        </div>
      )}
    </div>
  );
}
