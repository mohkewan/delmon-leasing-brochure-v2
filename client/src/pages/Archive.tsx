import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { ArrowRight, Trash2, FileDown, Loader2, Archive as ArchiveIcon, LogIn, Building2, MapPin, Calendar, FolderOpen } from "lucide-react";
import { generateBrochurePDF } from "@/lib/pdfGenerator";
import type { ProjectData } from "./Home";

export default function Archive() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data: brochures, isLoading } = trpc.brochures.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteMutation = trpc.brochures.delete.useMutation({
    onSuccess: () => {
      utils.brochures.list.invalidate();
      toast.success("تم حذف البروشور من الأرشيف");
    },
    onError: () => toast.error("خطأ في الحذف"),
  });

  const handleReExport = async (data: ProjectData) => {
    try {
      await generateBrochurePDF(data);
      toast.success("✅ تم تصدير البروشور");
    } catch {
      toast.error("خطأ في التصدير");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0]" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-[#949437]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F0F0] gap-4" dir="rtl">
        <ArchiveIcon className="w-16 h-16 text-[#949437]/40" />
        <h2 className="text-xl font-bold text-[#2C2C2C]">يجب تسجيل الدخول لعرض الأرشيف</h2>
        <Button onClick={() => startLogin()} className="bg-[#949437] hover:bg-[#7a7a2e] text-white">
          <LogIn className="w-4 h-4 ml-2" />
          تسجيل الدخول
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-[#949437]/40">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/delmon_logo_official_81df30cc.png" alt="دلمون" className="h-10 w-auto" />
            <div>
              <div className="font-black text-[#2C2C2C] text-base">أرشيف البروشورات</div>
              <div className="text-[#949437] text-[10px] font-semibold uppercase tracking-widest">BROCHURES ARCHIVE</div>
            </div>
          </div>
          <Button onClick={() => setLocation("/")} variant="outline" size="sm"
            className="border-[#949437]/50 text-[#949437] hover:bg-[#949437]/10 bg-transparent">
            <ArrowRight className="w-4 h-4 ml-1" />
            العودة للمنصة
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#949437]" />
          </div>
        ) : !brochures || brochures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ArchiveIcon className="w-20 h-20 text-[#949437]/20" />
            <h3 className="text-lg font-bold text-[#2C2C2C]">لا توجد بروشورات محفوظة بعد</h3>
            <p className="text-sm text-gray-500">قم بإنشاء بروشور واضغط "حفظ في الأرشيف" لحفظه هنا</p>
            <Button onClick={() => setLocation("/")} className="bg-[#949437] hover:bg-[#7a7a2e] text-white mt-2">
              إنشاء بروشور جديد
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#2C2C2C]">
                البروشورات المحفوظة ({brochures.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brochures.map((b) => {
                const data = b.data as ProjectData;
                const unitCount = data?.units?.length ?? 0;
                const totalArea = data?.units?.reduce((s, u) => s + (parseFloat(u.area) || 0), 0) ?? 0;
                const createdDate = new Date(b.createdAt).toLocaleDateString("ar-SA", {
                  year: "numeric", month: "long", day: "numeric"
                });
                return (
                  <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-[#D0D0D0] overflow-hidden hover:shadow-md transition-shadow">
                    {/* Card header */}
                    <div className="bg-[#949437] px-4 py-3">
                      <div className="text-white font-bold text-sm truncate">{b.projectName}</div>
                      <div className="text-white/70 text-xs">{b.projectType || "—"}</div>
                    </div>
                    {/* Card body */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#949437]" />
                        <span>{b.city || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-[#949437]" />
                        <span>{unitCount} وحدة — {totalArea.toLocaleString("en-US")} م²</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-[#8fa9dc]" />
                        <span>{createdDate}</span>
                      </div>
                    </div>
                    {/* Card actions */}
                    <div className="px-4 pb-4 flex gap-2">
                      <Button
                        onClick={() => handleReExport(data)}
                        size="sm"
                        className="flex-1 bg-[#949437] hover:bg-[#7a7a2e] text-white text-xs"
                      >
                        <FileDown className="w-3.5 h-3.5 ml-1" />
                        تصدير PDF
                      </Button>
                      <Button
                        onClick={() => {
                          localStorage.setItem("delmon_brochure_draft", JSON.stringify(data));
                          setLocation("/");
                          toast.success("تم تحميل البروشور للتحرير");
                        }}
                        size="sm"
                        variant="outline"
                        className="border-[#8fa9dc] text-[#555] hover:bg-[#8fa9dc]/10 bg-transparent text-xs"
                      >
                        <FolderOpen className="w-3.5 h-3.5 ml-1" />
                        تحرير
                      </Button>
                      <Button
                        onClick={() => deleteMutation.mutate({ id: b.id })}
                        disabled={deleteMutation.isPending}
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-400 hover:border-red-400 hover:text-red-600 bg-transparent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
