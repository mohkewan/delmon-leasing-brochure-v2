import { BrochureTemplate, BROCHURE_THEMES } from "@/lib/brochureTypes";
import { Check } from "lucide-react";

interface Props {
  selected: BrochureTemplate;
  onChange: (t: BrochureTemplate) => void;
}

// معاينة مصغرة لكل قالب — thumbnail بصري
function TemplateThumbnail({ id }: { id: BrochureTemplate }) {
  if (id === "classic") {
    return (
      <div style={{ width: 72, height: 50, background: "#fff", border: "1px solid #e0ddd0", borderRadius: 4, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <div style={{ height: 3, background: "#949437" }} />
        <div style={{ display: "flex", height: "calc(100% - 3px)" }}>
          <div style={{ width: 38, padding: "3px 4px", display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ height: 6, background: "#1a1a1a", borderRadius: 1, width: "90%" }} />
            <div style={{ height: 3, background: "#949437", borderRadius: 1, width: "70%" }} />
            <div style={{ height: 2, background: "#ccc", borderRadius: 1, width: "100%" }} />
            <div style={{ height: 2, background: "#ccc", borderRadius: 1, width: "80%" }} />
            <div style={{ display: "flex", gap: 1, marginTop: 1 }}>
              <div style={{ flex: 1, height: 8, background: "#f5f4f0", borderRadius: 2, borderRight: "2px solid #8fa9dc" }} />
              <div style={{ flex: 1, height: 8, background: "#f5f4f0", borderRadius: 2, borderRight: "2px solid #8fa9dc" }} />
            </div>
            <div style={{ height: 2, background: "#f0efe9", borderRadius: 1, marginTop: 1 }} />
            <div style={{ height: 4, background: "#949437", borderRadius: 1, marginTop: "auto" }} />
          </div>
          <div style={{ flex: 1, background: "#888", backgroundImage: "linear-gradient(135deg,#999 25%,#777 100%)" }} />
        </div>
      </div>
    );
  }
  if (id === "dark") {
    return (
      <div style={{ width: 72, height: 50, background: "#060e18", border: "1px solid #333", borderRadius: 4, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(135deg,#1a2a3a 0%,#060e18 60%)", opacity: 0.9 }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: "#949437" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 3, height: 2, background: "linear-gradient(to right,transparent,#8fa9dc,#949437)" }} />
        <div style={{ position: "absolute", top: 0, right: 3, bottom: 0, width: 38, padding: "4px 4px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ height: 6, background: "#fff", borderRadius: 1, width: "90%" }} />
          <div style={{ height: 3, background: "#949437", borderRadius: 1, width: "70%" }} />
          <div style={{ height: 2, background: "#555", borderRadius: 1, width: "100%" }} />
          <div style={{ display: "flex", gap: 1, marginTop: 1 }}>
            <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 2, borderRight: "2px solid rgba(148,148,55,0.5)" }} />
            <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 2, borderRight: "2px solid rgba(148,148,55,0.5)" }} />
          </div>
          <div style={{ height: 4, background: "rgba(4,10,18,0.95)", borderRadius: 1, marginTop: "auto", borderTop: "1px solid rgba(148,148,55,0.3)" }} />
        </div>
      </div>
    );
  }
  // magazine
  return (
    <div style={{ width: 72, height: 50, background: "#f7f6f2", border: "1px solid #e5e4de", borderRadius: 4, overflow: "hidden", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to left,#949437,#8fa9dc,#949437)" }} />
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ width: 38, background: "#fff", clipPath: "polygon(0 0,100% 0,94% 100%,0 100%)", padding: "4px 4px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ height: 5, background: "#949437", borderRadius: 1, width: "100%" }} />
          <div style={{ height: 6, background: "#1a1a1a", borderRadius: 1, width: "90%" }} />
          <div style={{ height: 3, background: "#949437", borderRadius: 1, width: "70%" }} />
          <div style={{ height: 2, background: "#ccc", borderRadius: 1, width: "100%" }} />
          <div style={{ display: "flex", gap: 1, marginTop: 1 }}>
            <div style={{ flex: 1, height: 7, background: "#f5f4f0", borderRadius: 2, borderRight: "3px solid #949437" }} />
            <div style={{ flex: 1, height: 7, background: "#f5f4f0", borderRadius: 2, borderRight: "3px solid #949437" }} />
          </div>
          <div style={{ height: 4, background: "#949437", borderRadius: 1, marginTop: "auto" }} />
        </div>
        <div style={{ flex: 1, background: "#888", backgroundImage: "linear-gradient(135deg,#999 25%,#777 100%)" }} />
      </div>
    </div>
  );
}

export default function TemplateSelector({ selected, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2" dir="rtl">
      <span className="text-xs text-[#8a8a8a] font-bold">اختر قالب البروشور:</span>
      <div className="flex gap-3">
        {BROCHURE_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id as BrochureTemplate)}
            title={theme.description}
            className={`
              relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-200 group
              ${selected === theme.id
                ? "border-[#949437] bg-[#949437]/5 shadow-md"
                : "border-gray-200 bg-white hover:border-[#949437]/50 hover:shadow-sm"
              }
            `}
          >
            <TemplateThumbnail id={theme.id as BrochureTemplate} />
            <div className="flex items-center gap-1">
              <span className={`text-xs font-bold ${selected === theme.id ? "text-[#949437]" : "text-gray-500 group-hover:text-[#949437]"}`}>
                {theme.nameAr}
              </span>
              {selected === theme.id && (
                <Check className="w-3 h-3 text-[#949437]" />
              )}
            </div>
            {selected === theme.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#949437] rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
