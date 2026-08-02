import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sparkles, Download, FileText, Loader2, CheckCircle2, AlertCircle,
  ChevronRight, Building2, Clock, Trash2, RefreshCw, Eye, LogIn
} from "lucide-react";
import { useLocation } from "wouter";

// ── Types ──────────────────────────────────────────────────────────────────────
interface JobStatus {
  id: number;
  status: "pending" | "processing" | "done" | "error";
  projectName: string;
  completedPages: number;
  totalPages: number;
  progress: number;
  pdfUrls?: { classic?: string; dark?: string; magazine?: string };
  pageUrls?: { classic?: string[]; dark?: string[]; magazine?: string[] };
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobListItem {
  id: number;
  projectName: string;
  status: string;
  completedPages: number;
  totalPages: number;
  progress: number;
  pdfUrls?: { classic?: string; dark?: string; magazine?: string };
  createdAt: string;
}

// ── Template info ──────────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "classic", nameAr: "الكلاسيكي", desc: "أبيض/كحلي/ذهبي — احترافي رسمي", color: "#1a2744" },
  { id: "dark", nameAr: "الفاخر الداكن", desc: "أسود/ذهبي — فاخر راقٍ", color: "#c9a84c" },
  { id: "magazine", nameAr: "المجلة", desc: "Editorial أبيض/كحلي — عصري", color: "#2d6a9f" },
];

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "في الانتظار", variant: "secondary" },
    processing: { label: "جاري التوليد", variant: "default" },
    done: { label: "مكتمل", variant: "outline" },
    error: { label: "خطأ", variant: "destructive" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "secondary" };
  return <Badge variant={variant}>{label}</Badge>;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AiBrochureGenerator() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Active job polling
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [activeJob, setActiveJob] = useState<JobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Jobs list
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Starting generation
  const [isStarting, setIsStarting] = useState(false);

  // ── Load jobs list ───────────────────────────────────────────────────────────
  const loadJobs = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingJobs(true);
    try {
      const resp = await fetch("/api/ai-brochure/list", { credentials: "include" });
      if (resp.ok) {
        const data = await resp.json();
        setJobs(data.reverse()); // newest first
      }
    } catch (e) {
      console.error("Failed to load jobs:", e);
    } finally {
      setLoadingJobs(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // ── Poll active job ──────────────────────────────────────────────────────────
  const pollJob = useCallback(async (jobId: number) => {
    try {
      const resp = await fetch(`/api/ai-brochure/status/${jobId}`, { credentials: "include" });
      if (!resp.ok) return;
      const job: JobStatus = await resp.json();
      setActiveJob(job);
      if (job.status === "done" || job.status === "error") {
        setIsPolling(false);
        if (pollRef.current) clearInterval(pollRef.current);
        loadJobs();
        if (job.status === "done") {
          toast.success("✅ اكتمل توليد البروشورات الثلاثة!");
        } else {
          toast.error("حدث خطأ أثناء التوليد");
        }
      }
    } catch (e) {
      console.error("Poll error:", e);
    }
  }, [loadJobs]);

  useEffect(() => {
    if (activeJobId && isPolling) {
      pollRef.current = setInterval(() => pollJob(activeJobId), 4000);
      return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }
  }, [activeJobId, isPolling, pollJob]);

  // ── Start generation from localStorage draft ─────────────────────────────────
  const handleStartGeneration = async () => {
    if (!isAuthenticated) { startLogin(); return; }

    // قراءة بيانات المشروع من localStorage
    let projectData: any = null;
    let projectImageBase64: string | undefined;
    try {
      const saved = localStorage.getItem("delmon_brochure_draft");
      if (saved) projectData = JSON.parse(saved);
      if (projectData?.projectImage) {
        projectImageBase64 = projectData.projectImage;
      }
    } catch {}

    if (!projectData?.projectName) {
      toast.error("يرجى إدخال بيانات المشروع أولاً في صفحة إنشاء البروشور");
      setLocation("/");
      return;
    }

    setIsStarting(true);
    try {
      const resp = await fetch("/api/ai-brochure/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projectData, projectImageBase64 }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error((err as any).error || `HTTP ${resp.status}`);
      }
      const { jobId } = await resp.json();
      setActiveJobId(jobId);
      setIsPolling(true);
      // جلب الحالة الأولى فوراً
      await pollJob(jobId);
      toast.success("🚀 بدأ التوليد! سيستغرق حوالي 5-10 دقائق");
    } catch (err: any) {
      toast.error(err.message || "خطأ في بدء التوليد");
    } finally {
      setIsStarting(false);
    }
  };

  // ── Delete job ───────────────────────────────────────────────────────────────
  const handleDeleteJob = async (jobId: number) => {
    try {
      await fetch(`/api/ai-brochure/${jobId}`, { method: "DELETE", credentials: "include" });
      setJobs(prev => prev.filter(j => j.id !== jobId));
      if (activeJobId === jobId) { setActiveJobId(null); setActiveJob(null); }
      toast.success("تم حذف المهمة");
    } catch {
      toast.error("خطأ في الحذف");
    }
  };

  // ── Resume polling for in-progress job ──────────────────────────────────────
  const handleResumePolling = (jobId: number) => {
    setActiveJobId(jobId);
    setIsPolling(true);
    pollJob(jobId);
  };

  // ── Auth guard ───────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#949437]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0]">
        <Card className="w-full max-w-sm text-center p-8">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-[#949437]" />
          <h2 className="text-xl font-bold mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-500 mb-6">يرجى تسجيل الدخول للوصول إلى ميزة التوليد بالذكاء الاصطناعي</p>
          <Button onClick={() => startLogin()} className="w-full bg-[#949437] hover:bg-[#7a7a2e]">
            تسجيل الدخول
          </Button>
        </Card>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F0F0F0] font-['Cairo',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="bg-[#1a2744] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#c9a84c]" />
          <div>
            <h1 className="text-lg font-bold">توليد البروشور بالذكاء الاصطناعي</h1>
            <p className="text-xs text-gray-300">3 قوالب احترافية — 7 صفحات لكل قالب</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:text-[#c9a84c]" onClick={() => setLocation("/")}>
          <ChevronRight className="w-4 h-4 ml-1" />
          العودة
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Info Cards — Templates */}
        <div className="grid grid-cols-3 gap-4">
          {TEMPLATES.map(t => (
            <Card key={t.id} className="border-2" style={{ borderColor: t.color + "40" }}>
              <CardContent className="pt-4 pb-3 text-center">
                <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ background: t.color }} />
                <p className="font-bold text-sm">{t.nameAr}</p>
                <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start Button */}
        <Card className="border-2 border-[#949437]/30 bg-gradient-to-l from-[#949437]/5 to-transparent">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1a2744]">توليد البروشورات الثلاثة</h2>
                <p className="text-sm text-gray-600 mt-1">
                  سيتم توليد 21 صفحة (7 × 3 قوالب) بالذكاء الاصطناعي مع بيانات مشروعك
                </p>
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  الوقت المتوقع: 5-10 دقائق
                </p>
              </div>
              <Button
                onClick={handleStartGeneration}
                disabled={isStarting || isPolling}
                className="bg-[#949437] hover:bg-[#7a7a2e] text-white px-6 py-3 text-base font-bold"
                size="lg"
              >
                {isStarting ? (
                  <><Loader2 className="w-5 h-5 ml-2 animate-spin" /> جاري البدء...</>
                ) : (
                  <><Sparkles className="w-5 h-5 ml-2" /> ابدأ التوليد</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Job Progress */}
        {activeJob && (
          <Card className="border-2 border-[#1a2744]/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  {activeJob.status === "processing" && <Loader2 className="w-4 h-4 animate-spin text-[#949437]" />}
                  {activeJob.status === "done" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  {activeJob.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {activeJob.projectName}
                </span>
                <StatusBadge status={activeJob.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{activeJob.completedPages} / {activeJob.totalPages} صفحة مكتملة</span>
                  <span>{activeJob.progress}%</span>
                </div>
                <Progress value={activeJob.progress} className="h-3" />
              </div>

              {/* Template progress */}
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((t, ti) => {
                  const templatePages = activeJob.pageUrls?.[t.id as keyof typeof activeJob.pageUrls] ?? [];
                  const done = templatePages.filter(Boolean).length;
                  const pct = Math.round((done / 7) * 100);
                  return (
                    <div key={t.id} className="text-center p-3 rounded-lg bg-gray-50 border">
                      <p className="text-xs font-bold mb-1">{t.nameAr}</p>
                      <Progress value={pct} className="h-2 mb-1" />
                      <p className="text-xs text-gray-500">{done}/7</p>
                    </div>
                  );
                })}
              </div>

              {/* Error */}
              {activeJob.status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {activeJob.errorMessage || "حدث خطأ غير متوقع"}
                </div>
              )}

              {/* Download PDFs */}
              {activeJob.status === "done" && activeJob.pdfUrls && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> البروشورات جاهزة للتحميل
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {TEMPLATES.map(t => {
                      const url = activeJob.pdfUrls?.[t.id as keyof typeof activeJob.pdfUrls];
                      return (
                        <a
                          key={t.id}
                          href={url || "#"}
                          download={`بروشور-دلمون-${activeJob.projectName}-${t.nameAr}.pdf`}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${url ? "border-[#949437] bg-[#949437]/5 hover:bg-[#949437]/10 cursor-pointer" : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"}`}
                        >
                          <FileText className="w-6 h-6 text-[#949437]" />
                          <span className="text-xs font-bold">{t.nameAr}</span>
                          <Download className="w-4 h-4 text-gray-500" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Jobs History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1a2744]" />
                سجل المهام
              </span>
              <Button variant="ghost" size="sm" onClick={loadJobs} disabled={loadingJobs}>
                <RefreshCw className={`w-4 h-4 ${loadingJobs ? "animate-spin" : ""}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">لا توجد مهام سابقة</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm truncate">{job.projectName}</p>
                        <StatusBadge status={job.status} />
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={job.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-gray-500 shrink-0">{job.progress}%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(job.createdAt).toLocaleString("en-US")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Resume polling if still processing */}
                      {job.status === "processing" && job.id !== activeJobId && (
                        <Button variant="ghost" size="sm" onClick={() => handleResumePolling(job.id)} title="متابعة">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </Button>
                      )}
                      {/* Download PDFs if done */}
                      {job.status === "done" && job.pdfUrls && (
                        <div className="flex gap-1">
                          {TEMPLATES.map(t => {
                            const url = job.pdfUrls?.[t.id as keyof typeof job.pdfUrls];
                            return url ? (
                              <a key={t.id} href={url} download={`بروشور-${job.projectName}-${t.nameAr}.pdf`} title={t.nameAr}>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4 text-[#949437]" />
                                </Button>
                              </a>
                            ) : null;
                          })}
                        </div>
                      )}
                      {/* Delete */}
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)} title="حذف">
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
