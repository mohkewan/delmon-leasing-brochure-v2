import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUp, Loader2, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { ProjectData } from "@/pages/Home";

interface ProjectTabProps {
  projectData: ProjectData;
  updateProject: (field: keyof ProjectData, value: string) => void;
}

const PROJECT_TYPES = ["مجمع تجاري", "مول تجاري", "مكاتب إدارية", "معارض", "فندق", "سكني", "مستودعات", "مشروع متعدد الاستخدامات"];

export default function ProjectTab({ projectData, updateProject }: ProjectTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const rawDataUrl = ev.target?.result as string;
      if (!rawDataUrl) return;
      setIsEnhancing(true);
      try {
        const resp = await fetch("/api/enhance-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageDataUrl: rawDataUrl }),
        });
        if (resp.ok) {
          const { enhancedDataUrl } = await resp.json();
          updateProject("projectImage", enhancedDataUrl);
        } else {
          updateProject("projectImage", rawDataUrl);
        }
      } catch {
        updateProject("projectImage", rawDataUrl);
      } finally {
        setIsEnhancing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-start gap-3 border-r-2 border-[#94B6D2] bg-[#edf4fa]/70 px-4 py-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#949437]" />
        <div>
          <p className="text-xs font-extrabold text-[#262626]">عرّف المشروع كما يراه العميل</p>
          <p className="mt-1 text-[11px] leading-5 text-[#626262]">اكتب حقائق قصيرة وواضحة؛ ستظهر في الغلاف، وصف المشروع، وصفحة مزايا الموقع.</p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="delmon-kicker">01 / تعريف المشروع</span>
          <span className="h-px flex-1 bg-[#E2E5E3]" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="delmon-label mb-1.5 block">اسم المشروع <span className="text-[#DD8047]">*</span></Label>
            <Input value={projectData.projectName} onChange={(e) => updateProject("projectName", e.target.value)} placeholder="مثال: بارك فيو" className="border-[#E2E5E3] bg-white focus-visible:ring-[#94B6D2]" />
          </div>
          <div>
            <Label className="delmon-label mb-1.5 block">نوع المشروع</Label>
            <Select value={projectData.projectType} onValueChange={(v) => updateProject("projectType", v)}>
              <SelectTrigger className="border-[#E2E5E3] bg-white focus:ring-[#94B6D2]"><SelectValue placeholder="اختر نوع المشروع" /></SelectTrigger>
              <SelectContent>{PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="delmon-label mb-1.5 block">المدينة</Label>
            <Input value={projectData.city} onChange={(e) => updateProject("city", e.target.value)} placeholder="مثال: محايل عسير" className="border-[#E2E5E3] bg-white focus-visible:ring-[#94B6D2]" />
          </div>
          <div>
            <Label className="delmon-label mb-1.5 block">الحي / الموقع</Label>
            <Input value={projectData.district} onChange={(e) => updateProject("district", e.target.value)} placeholder="مثال: حي الملك فهد" className="border-[#E2E5E3] bg-white focus-visible:ring-[#94B6D2]" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="delmon-kicker">02 / حقائق سريعة</span>
          <span className="h-px flex-1 bg-[#E2E5E3]" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label className="delmon-label mb-1.5 block">إجمالي المساحة (م²)</Label>
            <Input value={projectData.totalArea} onChange={(e) => updateProject("totalArea", e.target.value)} placeholder="مثال: 5,000" inputMode="decimal" className="border-[#E2E5E3] bg-white focus-visible:ring-[#94B6D2]" />
          </div>
          <div>
            <Label className="delmon-label mb-1.5 block">عدد الطوابق</Label>
            <Input value={projectData.floors} onChange={(e) => updateProject("floors", e.target.value)} placeholder="مثال: 5" inputMode="numeric" className="border-[#E2E5E3] bg-white focus-visible:ring-[#94B6D2]" />
          </div>
          <div>
            <Label className="delmon-label mb-1.5 block">سنة الإنجاز</Label>
            <Input value={projectData.completionYear} onChange={(e) => updateProject("completionYear", e.target.value)} placeholder="مثال: 2024" inputMode="numeric" className="border-[#E2E5E3] bg-white focus-visible:ring-[#94B6D2]" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="delmon-kicker">03 / الرسالة التسويقية</span>
          <span className="h-px flex-1 bg-[#E2E5E3]" />
        </div>
        <div>
          <Label className="delmon-label mb-1.5 block">وصف المشروع</Label>
          <Textarea value={projectData.description} onChange={(e) => updateProject("description", e.target.value)} placeholder="اكتب وصفاً مختصراً يوضح طبيعة المشروع وموقعه والعميل المستهدف..." rows={3} className="resize-none border-[#E2E5E3] bg-white leading-6 focus-visible:ring-[#94B6D2]" />
        </div>
        <div>
          <Label className="delmon-label mb-1.5 block">المرافق والخدمات</Label>
          <Textarea value={projectData.amenities} onChange={(e) => updateProject("amenities", e.target.value)} placeholder="افصل بين المزايا بفاصلة: مواقف سيارات، أمن وحراسة، مصاعد..." rows={2} className="resize-none border-[#E2E5E3] bg-white leading-6 focus-visible:ring-[#94B6D2]" />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="delmon-kicker">04 / الصورة الرئيسية</span>
          <span className="h-px flex-1 bg-[#E2E5E3]" />
        </div>
        <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer border border-dashed border-[#94B6D2] bg-[#edf4fa]/35 p-4 transition-colors hover:bg-[#edf4fa]/70">
          {isEnhancing ? (
            <div className="flex min-h-28 flex-col items-center justify-center gap-2 text-[#6f96b8]"><Loader2 className="h-5 w-5 animate-spin" /><span className="text-xs font-bold">جاري تجهيز الصورة للمعاينة</span></div>
          ) : projectData.projectImage ? (
            <img src={projectData.projectImage} alt="صورة المشروع" className="mx-auto max-h-52 w-full object-cover" />
          ) : (
            <div className="flex min-h-28 flex-col items-center justify-center gap-2 text-center"><ImageUp className="h-6 w-6 text-[#949437]" /><span className="text-xs font-extrabold text-[#262626]">أضف صورة حقيقية للمشروع</span><span className="text-[11px] text-[#6a6a6a]">ستظهر في الغلاف والصفحات التسويقية للبروشور.</span></div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </section>
    </div>
  );
}
