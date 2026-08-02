import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

    // قراءة الصورة كـ base64 أولاً
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const rawDataUrl = ev.target?.result as string;
      if (!rawDataUrl) return;

      // محاولة تحسين الصورة عبر السيرفر
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
          // fallback: استخدام الصورة الأصلية بدون تحسين
          updateProject("projectImage", rawDataUrl);
        }
      } catch {
        // fallback: استخدام الصورة الأصلية بدون تحسين
        updateProject("projectImage", rawDataUrl);
      } finally {
        setIsEnhancing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
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
          <Select value={projectData.projectType} onValueChange={(v) => updateProject("projectType", v)}>
            <SelectTrigger className="border-[#D0D0D0] focus:border-[#949437]">
              <SelectValue placeholder="اختر نوع المشروع" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          {isEnhancing ? (
            <div className="text-[#949437] text-sm py-4">
              <div className="text-2xl mb-2 animate-spin inline-block">⚙️</div>
              <div>جاري تحسين جودة الصورة...</div>
            </div>
          ) : projectData.projectImage ? (
            <img
              src={projectData.projectImage}
              alt="صورة المشروع"
              className="max-h-32 mx-auto rounded-lg object-cover"
            />
          ) : (
            <div className="text-gray-400 text-sm">
              <div className="text-2xl mb-1">🖼️</div>
              انقر لرفع صورة المشروع (يتم تحسين الجودة تلقائياً)
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
  );
}
