import { BrochureTemplate } from "@/lib/brochureTypes";
import { Check, LayoutTemplate, Sparkles } from "lucide-react";

interface Props {
  selected: BrochureTemplate;
  onChange: (t: BrochureTemplate) => void;
}

function DelmonTemplateThumbnail() {
  return (
    <div className="relative h-[62px] w-[94px] shrink-0 overflow-hidden border border-[#94B6D2]/70 bg-white shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#949437]" />
      <div className="absolute left-0 top-1 h-full w-[46%] bg-[#262626]" />
      <div className="absolute left-0 top-1 h-full w-[46%] bg-[linear-gradient(145deg,rgba(38,38,38,.92),rgba(38,38,38,.58))]" />
      <div className="absolute left-2 top-3 h-9 w-8 border border-[#94B6D2]" />
      <div className="absolute right-2 top-3 flex w-[42%] flex-col gap-1.5">
        <div className="h-2 w-full bg-[#262626]" />
        <div className="h-1 w-2/3 bg-[#949437]" />
        <div className="h-1 w-full bg-[#dfe7ee]" />
        <div className="h-1 w-4/5 bg-[#dfe7ee]" />
      </div>
      <div className="absolute bottom-2 right-2 h-3 w-[42%] border-r-2 border-[#94B6D2] bg-[#F7F7F4]" />
    </div>
  );
}

export default function TemplateSelector({ selected, onChange }: Props) {
  const isCorporate = selected === "classic";

  return (
    <div className="flex flex-col gap-2" dir="rtl">
      <div className="flex items-center justify-between gap-2">
        <span className="delmon-kicker">نمط البروشور</span>
        <span className="text-[10px] text-[#6f96b8]">مرجع الهوية المعتمد</span>
      </div>
      <button
        type="button"
        onClick={() => onChange("classic")}
        className={`group relative flex w-full items-center gap-3 rounded-lg border p-2.5 text-right transition-all ${
          isCorporate
            ? "border-[#949437] bg-[#949437]/[0.05] shadow-sm"
            : "border-[#E2E5E3] bg-white hover:border-[#94B6D2]"
        }`}
      >
        <DelmonTemplateThumbnail />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5">
            <LayoutTemplate className="h-3.5 w-3.5 text-[#949437]" />
            <span className="text-xs font-extrabold text-[#262626]">هوية دلمون للتأجير</span>
          </div>
          <p className="text-[10px] leading-4 text-[#696969]">
            قالب تسويقي موحد للوحدات الشاغرة، متسق مع العرض المؤسسي المعتمد.
          </p>
        </div>
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#949437] bg-white">
          {isCorporate ? <Check className="h-3 w-3 text-[#949437]" /> : <Sparkles className="h-3 w-3 text-[#94B6D2]" />}
        </div>
      </button>
    </div>
  );
}
