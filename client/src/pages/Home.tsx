import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, FileDown, Eye, Building2, MapPin, Phone, Mail, Globe, Loader2, CheckCircle2, LayoutList } from "lucide-react";
import BrochurePreview from "@/components/BrochurePreview";
import { generateBrochurePDF } from "@/lib/pdfGenerator";

// ===== DELMON INVESTMENT BRAND IDENTITY =====
// Primary: Deep GOLD #949437 | Cyan: #8fa9dc | Background: #F0F0F0 | Font: Cairo
// Layout: RTL sidebar form + live preview panel

export type UnitType = "مكتب" | "معرض" | "محل تجاري" | "مستودع" | "وحدة سكنية" | "فندق" | "أخرى";

export interface Unit {
  id: string;
  unitNumber: string;
  floor: string;
  area: string;
  unitType: UnitType;
  description: string;
  features: string;
  pricePerMeter?: string;
  monthlyRent?: string;
}

export interface ProjectData {
  projectName: string;
  projectType: string;
  city: string;
  district: string;
  totalArea: string;
  floors: string;
  completionYear: string;
  description: string;
  amenities: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  projectImage?: string;
  units: Unit[];
}

const PROJECTS = [
  { id: "1", name: "بارك فيو - محايل عسير", type: "مول تجاري", city: "محايل عسير" },
  { id: "2", name: "دلمون مكتبي 2", type: "مبنى مكتبي", city: "جازان" },
  { id: "3", name: "معارض جازان 1", type: "معارض", city: "جازان" },
  { id: "4", name: "رفالا الأولى", type: "سترب مول", city: "أبها" },
  { id: "5", name: "فندق لؤلؤة جازان", type: "فندق", city: "جازان" },
  { id: "6", name: "دلمون مكتبي 1", type: "مبنى مكتبي", city: "جازان" },
  { id: "7", name: "معارض جازان 2", type: "معارض", city: "جازان" },
  { id: "8", name: "رفالا الثانية", type: "سترب مول", city: "خميس مشيط" },
  { id: "9", name: "دلمون 3", type: "مبنى مكتبي", city: "الرياض" },
  { id: "10", name: "فندق جيزان", type: "فندق", city: "جازان" },
  { id: "custom", name: "مشروع آخر (إدخال يدوي)", type: "", city: "" },
];

const UNIT_TYPES: UnitType[] = ["مكتب", "معرض", "محل تجاري", "مستودع", "وحدة سكنية", "فندق", "أخرى"];

const emptyUnit = (): Unit => ({
  id: crypto.randomUUID(),
  unitNumber: "",
  floor: "",
  area: "",
  unitType: "مكتب",
  description: "",
  features: "",
  pricePerMeter: "",
  monthlyRent: "",
});

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: "",
    projectType: "",
    city: "",
    district: "",
    totalArea: "",
    floors: "",
    completionYear: "",
    description: "",
    amenities: "",
    contactName: "قسم التأجير - دلمون للاستثمار",
    contactPhone: "011-2080129",
    contactEmail: "info@delmoninvest.com",
    projectImage: "",
    units: [emptyUnit()],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"project" | "units" | "contact">("project");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportStep, setExportStep] = useState<string>("");
  const [exportDone, setExportDone] = useState(false);

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    const proj = PROJECTS.find((p) => p.id === id);
    if (proj && id !== "custom") {
      setProjectData((prev) => ({
        ...prev,
        projectName: proj.name,
        projectType: proj.type,
        city: proj.city,
      }));
    } else if (id === "custom") {
      setProjectData((prev) => ({ ...prev, projectName: "", projectType: "", city: "" }));
    }
  };

  const updateProject = useCallback((field: keyof ProjectData, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addUnit = () => {
    setProjectData((prev) => ({ ...prev, units: [...prev.units, emptyUnit()] }));
  };

  const removeUnit = (id: string) => {
    setProjectData((prev) => ({
      ...prev,
      units: prev.units.filter((u) => u.id !== id),
    }));
  };

  const updateUnit = (id: string, field: keyof Unit, value: string) => {
    setProjectData((prev) => ({
      ...prev,
      units: prev.units.map((u) => (u.id === id ? { ...u, [field]: value } : u)),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProject("projectImage", ev.target?.result as string);
      toast.success("تم رفع صورة المشروع بنجاح");
    };
    reader.readAsDataURL(file);
  };

  const handleExportPDF = async () => {
    if (!projectData.projectName) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }
    if (projectData.units.some((u) => !u.area)) {
      toast.warning("يرجى إدخال مساحة جميع الوحدات");
      return;
    }
    setIsGenerating(true);
    setExportDone(false);
    setExportStep("جاري تجهيز البروشور...");
    try {
      await new Promise((r) => setTimeout(r, 200));
      setExportStep("جاري معالجة الصفحات...");
      await generateBrochurePDF(projectData);
      setExportStep("تم بنجاح!");
      setExportDone(true);
      toast.success("✅ تم تصدير البروشور بنجاح!");
      setTimeout(() => { setExportDone(false); setExportStep(""); }, 3000);
    } catch (err) {
      toast.error("حدث خطأ أثناء التصدير، يرجى المحاولة مرة أخرى");
      console.error(err);
      setExportStep("");
    } finally {
      setIsGenerating(false);
    }
  };

  const totalArea = projectData.units.reduce((sum, u) => sum + (parseFloat(u.area) || 0), 0);

  // Completion percentage for progress indicator
  const filledFields = [
    projectData.projectName,
    projectData.projectType,
    projectData.city,
    projectData.description,
  ].filter(Boolean).length;
  const completionPct = Math.round((filledFields / 4) * 100);
  const unitsWithArea = projectData.units.filter((u) => u.area).length;

  return (
    <div className="min-h-screen bg-[#F0F0F0]" dir="rtl">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-[#949437]/40">
        <div className="max-w-7xl mx-auto px-5 flex items-stretch justify-between">
          {/* Brand lockup */}
          <div className="flex items-center gap-4 py-3">
            <img
              src="/manus-storage/delmon_logo_official_81df30cc.png"
              alt="دلمون للاستثمار"
              className="h-11 w-auto object-contain"
            />
            <div className="border-r border-white/25 pr-4 mr-1">
              <div
                className="text-[#2C2C2C] font-black text-lg leading-tight tracking-wide"
                style={{ fontFamily: "'Noto Kufi Arabic', 'Cairo', sans-serif" }}
              >
                شركة دلمون للاستثمار
              </div>
              <div className="text-[#949437] text-[10px] font-semibold tracking-[0.14em] uppercase">
                DELMON INVESTMENT COMPANY
              </div>
            </div>
          </div>
          {/* Center system label */}
          <div className="hidden md:flex items-center">
              <div className="border border-[#949437]/30 rounded-md px-4 py-1.5 bg-[#949437]/5">
                <span className="text-[#555555] text-sm font-medium">نظام بروشور التأجير</span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 py-3">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              size="sm"
              className="border-[#8fa9dc]/60 text-[#555555] hover:border-[#949437] hover:text-[#949437] bg-transparent transition-all"
            >
              <Eye className="w-4 h-4 ml-1" />
              معاينة
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={isGenerating}
              size="sm"
              className="bg-[#949437] hover:bg-[#7a7a2e] text-white font-bold transition-all shadow-md"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <FileDown className="w-4 h-4 ml-1" />}
              {isGenerating ? exportStep : "تصدير PDF"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ===== STATS BAR ===== */}
        {/* ===== STATS BAR ===== */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "إجمالي الوحدات", value: String(projectData.units.length), icon: Building2 },
            { label: "إجمالي المساحة", value: `${totalArea.toLocaleString("ar-SA")} م²`, icon: MapPin },
            { label: "المشروع المحدد", value: projectData.projectName || "—", icon: Building2 },
            { label: "اكتمال البيانات", value: `${completionPct}%`, icon: LayoutList },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-[#D0D0D0] flex items-center gap-3 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#949437] rounded-r-xl" />
              <div className="w-10 h-10 rounded-lg bg-[#949437]/10 border border-[#949437]/20 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-5 h-5 text-[#949437]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-gray-500 font-medium">{stat.label}</div>
                <div className="font-black text-[#2C2C2C] text-base truncate">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ===== FORM PANEL ===== */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-[#D0D0D0] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b-2 border-[#D0D0D0] bg-[#F8F9FD]">
              {[
                { id: "project", label: "بيانات المشروع" },
                { id: "units", label: `الوحدات (${projectData.units.length})` },
                { id: "contact", label: "معلومات التواصل" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 py-3 text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "text-[#2C2C2C] border-b-2 border-[#949437] bg-white font-bold"
                      : "text-gray-400 hover:text-[#2C2C2C] hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ---- PROJECT TAB ---- */}
              {activeTab === "project" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#2C2C2C] font-semibold mb-1 block">اختر المشروع</Label>
                    <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
                      <SelectTrigger className="border-[#D0D0D0] focus:border-[#949437]">
                        <SelectValue placeholder="اختر مشروعاً من قائمة دلمون..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECTS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#2C2C2C] font-semibold mb-1 block">اسم المشروع *</Label>
                      <Input
                        value={projectData.projectName}
                        onChange={(e) => updateProject("projectName", e.target.value)}
                        placeholder="مثال: بارك فيو"
                        className="border-[#D0D0D0] focus:border-[#949437]"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2C2C2C] font-semibold mb-1 block">نوع المشروع</Label>
                      <Input
                        value={projectData.projectType}
                        onChange={(e) => updateProject("projectType", e.target.value)}
                        placeholder="مثال: مول تجاري"
                        className="border-[#D0D0D0] focus:border-[#949437]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#2C2C2C] font-semibold mb-1 block">المدينة</Label>
                      <Input
                        value={projectData.city}
                        onChange={(e) => updateProject("city", e.target.value)}
                        placeholder="مثال: جازان"
                        className="border-[#D0D0D0] focus:border-[#949437]"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2C2C2C] font-semibold mb-1 block">الحي / الموقع</Label>
                      <Input
                        value={projectData.district}
                        onChange={(e) => updateProject("district", e.target.value)}
                        placeholder="مثال: حي الروابي"
                        className="border-[#D0D0D0] focus:border-[#949437]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-[#2C2C2C] font-semibold mb-1 block">إجمالي المساحة (م²)</Label>
                      <Input
                        value={projectData.totalArea}
                        onChange={(e) => updateProject("totalArea", e.target.value)}
                        placeholder="مثال: 5000"
                        className="border-[#D0D0D0] focus:border-[#949437]"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2C2C2C] font-semibold mb-1 block">عدد الطوابق</Label>
                      <Input
                        value={projectData.floors}
                        onChange={(e) => updateProject("floors", e.target.value)}
                        placeholder="مثال: 5"
                        className="border-[#D0D0D0] focus:border-[#949437]"
                      />
                    </div>
                    <div>
                      <Label className="text-[#2C2C2C] font-semibold mb-1 block">سنة الإنجاز</Label>
                      <Input
                        value={projectData.completionYear}
                        onChange={(e) => updateProject("completionYear", e.target.value)}
                        placeholder="مثال: 2024"
                        className="border-[#D0D0D0] focus:border-[#949437]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#2C2C2C] font-semibold mb-1 block">وصف المشروع</Label>
                    <Textarea
                      value={projectData.description}
                      onChange={(e) => updateProject("description", e.target.value)}
                      placeholder="وصف مختصر عن المشروع وموقعه ومميزاته..."
                      rows={3}
                      className="border-[#D0D0D0] focus:border-[#949437] resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-[#2C2C2C] font-semibold mb-1 block">المرافق والخدمات</Label>
                    <Textarea
                      value={projectData.amenities}
                      onChange={(e) => updateProject("amenities", e.target.value)}
                      placeholder="مثال: مواقف سيارات، أمن 24 ساعة، مصاعد، تكييف مركزي..."
                      rows={2}
                      className="border-[#D0D0D0] focus:border-[#949437] resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-[#2C2C2C] font-semibold mb-1 block">صورة المشروع (اختياري)</Label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#949437]/40 rounded-xl p-4 text-center cursor-pointer hover:border-[#949437] hover:bg-[#949437]/5 transition-all"
                    >
                      {projectData.projectImage ? (
                        <img
                          src={projectData.projectImage}
                          alt="صورة المشروع"
                          className="max-h-32 mx-auto rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">
                          <div className="text-2xl mb-1">🖼️</div>
                          انقر لرفع صورة المشروع
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              )}

              {/* ---- UNITS TAB ---- */}
              {activeTab === "units" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#2C2C2C]">الوحدات الشاغرة ({projectData.units.length})</h3>
                    <Button
                      onClick={addUnit}
                      size="sm"
                      className="bg-[#1A2E5A] hover:bg-[#243a72] text-white"
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      إضافة وحدة
                    </Button>
                  </div>

                  {projectData.units.map((unit, idx) => (
                    <div
                      key={unit.id}
                      className="border border-[#D0D0D0] rounded-xl p-4 bg-[#F8F9FD] relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-[#2C2C2C] bg-[#1A2E5A]/10 px-3 py-1 rounded-full">
                          وحدة {idx + 1}
                        </span>
                        {projectData.units.length > 1 && (
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
                          <Label className="text-xs text-gray-600 mb-1 block">المساحة (م²) *</Label>
                          <Input
                            value={unit.area}
                            onChange={(e) => updateUnit(unit.id, "area", e.target.value)}
                            placeholder="مثال: 150"
                            type="number"
                            className="h-8 text-sm border-[#D0D0D0]"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">نوع الوحدة</Label>
                          <Select
                            value={unit.unitType}
                            onValueChange={(v) => updateUnit(unit.id, "unitType", v)}
                          >
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
                          <Label className="text-xs text-gray-600 mb-1 block">الإيجار الشهري (ريال)</Label>
                          <Input
                            value={unit.monthlyRent}
                            onChange={(e) => updateUnit(unit.id, "monthlyRent", e.target.value)}
                            placeholder="مثال: 5000"
                            type="number"
                            className="h-8 text-sm border-[#D0D0D0]"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">السعر / م² (ريال)</Label>
                          <Input
                            value={unit.pricePerMeter}
                            onChange={(e) => updateUnit(unit.id, "pricePerMeter", e.target.value)}
                            placeholder="مثال: 100"
                            type="number"
                            className="h-8 text-sm border-[#D0D0D0]"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label className="text-xs text-gray-600 mb-1 block">مميزات الوحدة</Label>
                        <Input
                          value={unit.features}
                          onChange={(e) => updateUnit(unit.id, "features", e.target.value)}
                          placeholder="مثال: واجهة زجاجية، تكييف مركزي، مدخل مستقل"
                          className="h-8 text-sm border-[#D0D0D0]"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={addUnit}
                    variant="outline"
                    className="w-full border-dashed border-[#949437]/50 text-[#2C2C2C] hover:bg-[#949437]/5"
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة وحدة جديدة
                  </Button>
                </div>
              )}

              {/* ---- CONTACT TAB ---- */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#2C2C2C] font-semibold mb-1 block">
                      <Phone className="w-4 h-4 inline ml-1" />
                      اسم المسؤول / القسم
                    </Label>
                    <Input
                      value={projectData.contactName}
                      onChange={(e) => updateProject("contactName", e.target.value)}
                      className="border-[#D0D0D0] focus:border-[#949437]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#2C2C2C] font-semibold mb-1 block">
                      <Phone className="w-4 h-4 inline ml-1" />
                      رقم الهاتف
                    </Label>
                    <Input
                      value={projectData.contactPhone}
                      onChange={(e) => updateProject("contactPhone", e.target.value)}
                      className="border-[#D0D0D0] focus:border-[#949437]"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label className="text-[#2C2C2C] font-semibold mb-1 block">
                      <Mail className="w-4 h-4 inline ml-1" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      value={projectData.contactEmail}
                      onChange={(e) => updateProject("contactEmail", e.target.value)}
                      className="border-[#D0D0D0] focus:border-[#949437]"
                      dir="ltr"
                    />
                  </div>
                  <div className="bg-[#1A2E5A]/5 rounded-xl p-4 border border-[#1A2E5A]/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-[#2C2C2C]" />
                      <span className="text-sm font-semibold text-[#2C2C2C]">معلومات الشركة الثابتة</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>الموقع: www.delmoninvest.com</div>
                      <div>المقر الرئيسي: الرياض - حي الروابي</div>
                      <div>هاتف: 011-2080129</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-[#F8F9FD] border-t border-[#D0D0D0] flex gap-3">
              <Button
                onClick={handleExportPDF}
                disabled={isGenerating}
                className="flex-1 bg-[#1A2E5A] hover:bg-[#243a72] text-white font-bold"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : exportDone ? (
                  <CheckCircle2 className="w-4 h-4 ml-2 text-green-400" />
                ) : (
                  <FileDown className="w-4 h-4 ml-2" />
                )}
                {isGenerating ? exportStep : exportDone ? "تم التصدير!" : "تصدير البروشور PDF"}
              </Button>
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                className="border-[#949437] text-[#949437] hover:bg-[#949437] hover:text-[#2C2C2C]"
              >
                <Eye className="w-4 h-4 ml-1" />
                معاينة
              </Button>
            </div>
          </div>

          {/* ===== MINI PREVIEW PANEL ===== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#D0D0D0] overflow-hidden sticky top-24 flex flex-col">
              <div className="bg-[#1A2E5A] px-4 py-3 flex items-center justify-between">
                <span className="text-white text-sm font-semibold">معاينة البروشور</span>
                <button
                  onClick={() => setShowPreview(true)}
                  className="text-[#949437] text-xs hover:underline"
                >
                  عرض كامل
                </button>
              </div>
              {/* Progress bar */}
              <div className="h-1 bg-gray-100">
                <div
                  className="h-1 bg-[#949437] transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="p-3 bg-[#F0F3FA] overflow-hidden" style={{ maxHeight: "calc(100vh - 230px)" }}>
                <div
                  className="origin-top-right scale-[0.45] w-[222%] pointer-events-none"
                  style={{ transformOrigin: "top right" }}
                >
                  <BrochurePreview data={projectData} />
                </div>
              </div>
              {/* Units counter */}
              <div className="px-4 py-2 border-t border-[#D0D0D0] bg-white flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {unitsWithArea}/{projectData.units.length} وحدة مكتملة البيانات
                </span>
                <span className="text-xs font-bold text-[#2C2C2C]">
                  {totalArea > 0 ? `${totalArea.toLocaleString("ar-SA")} م²` : "أدخل المساحات"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FULL PREVIEW MODAL ===== */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-8"
          onClick={(e) => e.target === e.currentTarget && setShowPreview(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-[860px] w-full mx-4 overflow-hidden">
            <div className="bg-[#1A2E5A] px-6 py-4 flex items-center justify-between">
              <span className="text-white font-bold">معاينة البروشور الكاملة</span>
              <div className="flex gap-2">
                <Button
                  onClick={handleExportPDF}
                  disabled={isGenerating}
                  size="sm"
                  className="bg-[#949437] hover:bg-[#e0c06a] text-[#2C2C2C] font-bold"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <FileDown className="w-4 h-4 ml-1" />}
                  {isGenerating ? exportStep : "تصدير PDF"}
                </Button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-white/70 hover:text-white text-2xl leading-none px-2"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[82vh] bg-gray-100 p-4">
              <div className="shadow-xl">
              <BrochurePreview data={projectData} />
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
