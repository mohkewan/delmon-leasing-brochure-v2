import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Globe } from "lucide-react";
import { ProjectData } from "@/pages/Home";

interface ContactTabProps {
  projectData: ProjectData;
  updateProject: (field: keyof ProjectData, value: string) => void;
}

export default function ContactTab({ projectData, updateProject }: ContactTabProps) {
  return (
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
          placeholder="مثال: قسم التأجير"
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
          placeholder="مثال: 0172345678"
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
          placeholder="مثال: leasing@delmoninvest.com"
        />
      </div>
      <div className="bg-[#949437]/5 rounded-xl p-4 border border-[#949437]/15">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-[#2C2C2C]" />
          <span className="text-sm font-semibold text-[#2C2C2C]">معلومات الشركة الثابتة</span>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#949437] inline-block"></span>
            <span>الموقع: www.delmoninvest.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#949437] inline-block"></span>
            <span>المقر الرئيسي: الرياض - حي الروابي</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#949437] inline-block"></span>
            <span>هاتف: 011-2080129</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#949437] inline-block"></span>
            <span>البريد: info@delmoninvest.com</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="text-xs text-blue-600 font-medium mb-1">💡 ملاحظة</div>
        <div className="text-xs text-blue-500">
          معلومات التواصل المُدخلة ستظهر في البروشور المُصدَّر. معلومات الشركة الثابتة أعلاه تظهر دائماً في جميع البروشورات.
        </div>
      </div>
    </div>
  );
}
