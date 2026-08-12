import { formatNumber } from "@/lib/formatNumber";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { FileDown, Eye, Building2, MapPin, Loader2, CheckCircle2, LayoutList, Save, RotateCcw, Archive, LogOut, LogIn, User, TableProperties, Download, MessageCircle, Sparkles, Menu } from "lucide-react";
import BrochurePreview from "@/components/BrochurePreview";
import TemplateSelector from "@/components/TemplateSelector";
import { BrochureTemplate } from "@/lib/brochureTypes";
import ProjectTab from "@/components/ProjectTab";
import UnitsTab from "@/components/UnitsTab";
import ContactTab from "@/components/ContactTab";
// generateBrochurePDF removed; using server-side PDF via /api/generate-pdf

// ===== DELMON INVESTMENT BRAND IDENTITY =====
// Primary: Olive #949437 | Blue accent #94B6D2 | Canvas #F7F7F4
// Layout: RTL marketer workspace + live corporate brochure preview

// ===== PROJECT IMAGES MAP =====
// صور ثابتة لكل مشروع من مشاريع دلمون
const PROJECT_IMAGES: Record<string, string> = {
  "1": "/manus-storage/p1_park_view_main_01dcc575.jpg",   // بارك فيو - مول تجاري - محايل عسير (صورة حقيقية من الموقع)
  "2": "/manus-storage/p2_delmon_office2_f43dd896.jpg",   // دلمون مكتبي 2 - مبنى مكتبي - جازان
  "3": "/manus-storage/p3_mazaref_jazan1_b85a0a7f.jpg",   // معارض جازان 1 - معارض - جازان
  "4": "/manus-storage/p4_rafala1_d0da1bec.jpg",          // رفالا الأولى - سترب مول - أبها
  "5": "/manus-storage/p5_hotel_lulua_2d83a898.jpg",      // فندق لؤلؤة جازان - فندق - جازان
  "6": "/manus-storage/p6_delmon_office1_7a94ceaf.jpg",   // دلمون مكتبي 1 - مبنى مكتبي - جازان
  "7": "/manus-storage/p7_mazaref_jazan2_f597cf7b.jpg",   // معارض جازان 2 - معارض - جازان
  "8": "/manus-storage/p8_rafala2_76bd8200.jpg",          // رفالا الثانية - سترب مول - خميس مشيط
  "9": "/manus-storage/p9_delmon3_b422c301.jpg",          // دلمون 3 - مبنى مكتبي - الرياض
  "10": "/manus-storage/p10_hotel_jazan_07ba1132.png",    // فندق جيزان - فندق - جازان
};

const STORAGE_KEY = "delmon_brochure_draft";

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
  contractDuration?: string;
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
  {
    id: "1", name: "بارك فيو - محايل عسير", type: "مول تجاري", city: "محايل عسير",
    district: "طريق الخالدية", totalArea: "12800", floors: "2",
    completionYear: "2025",
    description: "بارك فيو مول وجهة تجارية وترفيهية متكاملة في قلب محايل عسير، يضم هايبر ماركت بمساحة 2,800 م²، هايبر ماركت ملابس وكماليات بأكثر من 5,000 م²، 60 محلاً تجارياً على الخط الرئيسي، ردهة مطاعم تضم 10 وحدات متنوعة، منطقة ترفيهية عائلية متكاملة، وحديقة مائية عائلية على مساحة تزيد عن 4,000 م².",
    amenities: "200 موقف سيارات — مركز صحي حكومي داخل المول — مجاور لمستشفى الحياة الوطني (أكثر من 300 سرير) — منصة فعاليات رئيسية — أمن 24 ساعة — مصاعد — تكييف مركزي",
  },
  { id: "2", name: "دلمون مكتبي 2", type: "مبنى مكتبي", city: "جازان", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "3", name: "معارض جازان 1", type: "معارض", city: "جازان", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "4", name: "رفالا الأولى", type: "سترب مول", city: "أبها", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "5", name: "فندق لؤلؤة جازان", type: "فندق", city: "جازان", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "6", name: "دلمون مكتبي 1", type: "مبنى مكتبي", city: "جازان", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "7", name: "معارض جازان 2", type: "معارض", city: "جازان", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "8", name: "رفالا الثانية", type: "سترب مول", city: "خميس مشيط", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "9", name: "دلمون 3", type: "مبنى مكتبي", city: "الرياض", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "10", name: "فندق جيزان", type: "فندق", city: "جازان", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
  { id: "custom", name: "مشروع آخر (إدخال يدوي)", type: "", city: "", district: "", totalArea: "", floors: "", completionYear: "", description: "", amenities: "" },
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
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  // ── DB units autosave ──────────────────────────────────────────────────────
  const [activeBrochureId, setActiveBrochureId] = useState<number | null>(null);
  const [unitsSavedToDb, setUnitsSavedToDb] = useState(false);
  const [pendingProjectSwitch, setPendingProjectSwitch] = useState<string | null>(null);
  const getOrCreateMutation = trpc.units.getOrCreate.useMutation({
    onSuccess: (data) => {
      const newBrochureId = data.brochureId;
      setActiveBrochureId(newBrochureId);
    },
  });
  const saveUnitsMutation = trpc.units.saveAll.useMutation({
    onSuccess: () => {
      setUnitsSavedToDb(true);
    },
  });

  const saveBrochureMutation = trpc.brochures.save.useMutation({
    onSuccess: () => {
      toast.success("✅ تم حفظ البروشور في الأرشيف");
      utils.brochures.list.invalidate();
    },
    onError: (err) => {
      const msg = err?.message ?? "";
      if (msg.includes("10001") || msg.toLowerCase().includes("login") || msg.toLowerCase().includes("unauthorized")) {
        toast.error("يجب تسجيل الدخول أولاً لحفظ البروشور في الأرشيف", {
          action: { label: "تسجيل الدخول", onClick: () => startLogin() },
          duration: 6000,
        });
      } else {
        toast.error(`خطأ في الحفظ: ${msg || "حاول مرة أخرى"}`);
      }
    },
  });
  const trackEventMutation = trpc.analytics.track.useMutation();


  const handleSaveToArchive = async () => {
    if (!projectData.projectName) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }
    if (!isAuthenticated) {
      toast.error("يجب تسجيل الدخول أولاً لحفظ البروشور في الأرشيف", {
        action: { label: "تسجيل الدخول", onClick: () => startLogin() },
        duration: 6000,
      });
      return;
    }
    saveBrochureMutation.mutate({
      projectName: projectData.projectName,
      projectType: projectData.projectType,
      city: projectData.city,
      data: projectData,
    });
    trackEventMutation.mutate({
      eventType: "archive_save",
      projectName: projectData.projectName,
      projectType: projectData.projectType,
      city: projectData.city,
      unitsCount: projectData.units.length,
    });
  };

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectData, setProjectData] = useState<ProjectData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
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
    };
  });
  // ── جلب الوحدات من DB عند توفر brochureId ──────────────────────────────────
  const dbUnitsLoadedRef = useRef(false);
  // يمنع autosave حتى يكتمل أول units.list (لمنع race condition)
  const dbUnitsReadyRef = useRef(false);
  // ref لحفظ الوحدات الحالية بدون إعادة تسجيل useEffect
  const currentUnitsRef = useRef<Unit[]>([]);
  useEffect(() => {
    currentUnitsRef.current = projectData.units;
  }, [projectData.units]);
  const unitsAutosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // autosave للوحدات في DB بعد 1500ms من توقف التعديل
  // إرسال saveAll فوراً عند ضبط activeBrochureId لأول مرة (بعد getOrCreate)
  const prevBrochureIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!activeBrochureId || !isAuthenticated) return;
    if (prevBrochureIdRef.current === activeBrochureId) return; // لم يتغير
    prevBrochureIdRef.current = activeBrochureId;
    // لا نحفظ هنا — ننتظر units.list أولاً قبل أي autosave
    dbUnitsReadyRef.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBrochureId, isAuthenticated]);
  // autosave للوحدات في DB بعد 1500ms من توقف التعديل
  useEffect(() => {
    // لا تحفظ حتى يكتمل units.list (لمنع مسح البيانات الحقيقية بوحدة فارغة مؤقتة)
    if (!activeBrochureId || !isAuthenticated || !dbUnitsReadyRef.current) return;
    setUnitsSavedToDb(false);
    if (unitsAutosaveTimerRef.current) clearTimeout(unitsAutosaveTimerRef.current);
    unitsAutosaveTimerRef.current = setTimeout(() => {
      saveUnitsMutation.mutate({
        brochureId: activeBrochureId,
        units: projectData.units.map((u) => ({
          unitKey: u.id,
          unitNumber: u.unitNumber,
          floor: u.floor,
          area: u.area,
          unitType: u.unitType,
          description: u.description,
          features: u.features,
          pricePerMeter: u.pricePerMeter,
          monthlyRent: u.monthlyRent,
        })),
      });
    }, 1500);
    return () => {
      if (unitsAutosaveTimerRef.current) clearTimeout(unitsAutosaveTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData.units, activeBrochureId, isAuthenticated]);

  // تحميل الوحدات من DB عند أول جلب ناجح (عبر query في JSX)
  const { data: dbUnits, isFetched: dbUnitsFetched } = trpc.units.list.useQuery(
    { brochureId: activeBrochureId ?? 0 },
    { enabled: !!activeBrochureId && isAuthenticated }
  );
  useEffect(() => {
    if (!dbUnitsFetched || !activeBrochureId) return;
    // units.list اكتمل — سواء بنتائج أو فارغاً
    if (!dbUnitsLoadedRef.current) {
      dbUnitsLoadedRef.current = true;
      if (dbUnits && dbUnits.length > 0) {
        // وجدت وحدات محفوظة → استبدل الوحدة الفارغة المؤقتة بها
        setProjectData((prev) => ({
          ...prev,
          units: dbUnits.map((u) => ({
            id: u.unitKey,
            unitNumber: u.unitNumber ?? "",
            floor: u.floor ?? "",
            area: u.area ?? "",
            unitType: (u.unitType as any) ?? "مكتب",
            description: u.description ?? "",
            features: u.features ?? "",
            pricePerMeter: u.pricePerMeter ?? "",
            monthlyRent: u.monthlyRent ?? "",
          })),
        }));
      }
      // في كلا الحالتين (وحدات موجودة أو لا) — فعّل autosave الآن
      dbUnitsReadyRef.current = true;
    }
  }, [dbUnits, dbUnitsFetched, activeBrochureId]);

  // ── getOrCreate تلقائي عند كتابة اسم المشروع (يدوي أو من قائمة) ─────────────
  const getOrCreateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isAuthenticated || !projectData.projectName) return;
    if (activeBrochureId) return; // لا داعي إذا كان لدينا ID بالفعل
    if (getOrCreateTimerRef.current) clearTimeout(getOrCreateTimerRef.current);
    getOrCreateTimerRef.current = setTimeout(() => {
      getOrCreateMutation.mutate({
        projectName: projectData.projectName,
        projectType: projectData.projectType || undefined,
        city: projectData.city || undefined,
        data: projectData as unknown as Record<string, unknown>,
      });
    }, 2000);
    return () => {
      if (getOrCreateTimerRef.current) clearTimeout(getOrCreateTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData.projectName, isAuthenticated, activeBrochureId]);



  // ─── debounce: لا نُعيد توليد المعاينة إلا بعد 400ms من توقف المستخدم عن الكتابة ───
  const [debouncedProjectData, setDebouncedProjectData] = useState(projectData);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProjectData(projectData);
    }, 400);
    return () => clearTimeout(timer);
  }, [projectData]);

  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"project" | "units" | "contact">("project");
  const [selectedTemplate, setSelectedTemplate] = useState<BrochureTemplate>("classic");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // قالب دلمون الرسمي هو خيار الإخراج الوحيد حتى لا تتفاوت هوية المخرجات التسويقية.
  const handleTemplateChange = () => {
    setSelectedTemplate("classic");
    try { localStorage.setItem("delmon_selected_template", "classic"); } catch {}
  };

  // helper: render the correct preview component
  const ActivePreview = BrochurePreview;

  const [exportStep, setExportStep] = useState<string>("");
  const [exportDone, setExportDone] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // ── بناء قائمة التحذيرات قبل التصدير ──────────────────────────────────
  const buildValidationWarnings = (): string[] => {
    const warnings: string[] = [];

    // 1. وصف المشروع ينتهي بـ "..."
    if (projectData.description && /\.{2,}$/.test(projectData.description.trim())) {
      warnings.push("وصف المشروع يبدو غير مكتمل (ينتهي بـ \"...\")");
    }

    // 2. وحدات بلا إيجار شهري
    const unitsNoRent = projectData.units.filter(
      (u) => !u.monthlyRent || parseFloat(String(u.monthlyRent).replace(/,/g, "")) <= 0
    );
    if (unitsNoRent.length > 0) {
      warnings.push(
        `${unitsNoRent.length} ${unitsNoRent.length === 1 ? "وحدة" : "وحدات"} بلا إيجار شهري — ستظهر "—" في البروشور`
      );
    }

    // 3. وحدات بلا سعر متر
    const unitsNoPrice = projectData.units.filter(
      (u) => !u.pricePerMeter || parseFloat(String(u.pricePerMeter).replace(/,/g, "")) <= 0
    );
    if (unitsNoPrice.length > 0) {
      warnings.push(
        `${unitsNoPrice.length} ${unitsNoPrice.length === 1 ? "وحدة" : "وحدات"} بلا سعر متر مربع — ستظهر "—" في البروشور`
      );
    }

    // 4. وحدات بلا مساحة
    const unitsNoArea = projectData.units.filter((u) => !u.area || parseFloat(u.area) <= 0);
    if (unitsNoArea.length > 0) {
      warnings.push(
        `${unitsNoArea.length} ${unitsNoArea.length === 1 ? "وحدة" : "وحدات"} بلا مساحة محددة`
      );
    }

    return warnings;
  };

  // ── Auto-save to localStorage ──────────────────────────────────────────────
  useEffect(() => {
    try {
      // استثناء projectImage من الحفظ التلقائي لتجنب تجميد الواجهة عند وجود صورة base64 ضخمة
      const { projectImage: _img, ...dataWithoutImage } = projectData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...dataWithoutImage, projectImage: "" }));
    } catch {}
  }, [projectData]);

  const doProjectSelect = (id: string) => {
    dbUnitsLoadedRef.current = false;
    dbUnitsReadyRef.current = false;
    setActiveBrochureId(null);
    setSelectedProjectId(id);
    const proj = PROJECTS.find((p) => p.id === id);
    if (proj && id !== "custom") {
      const newData = {
        projectName: proj.name,
        projectType: proj.type,
        city: proj.city,
        district: proj.district ?? "",
        totalArea: proj.totalArea ?? "",
        floors: proj.floors ?? "",
        completionYear: proj.completionYear ?? "",
        description: proj.description ?? "",
        amenities: proj.amenities ?? "",
        projectImage: PROJECT_IMAGES[id] || "",
      };
      setProjectData((prev) => ({ ...prev, ...newData, units: [emptyUnit()] }));
      // إنشاء أو جلب brochureId من DB إذا كان المستخدم مسجل الدخول
      if (isAuthenticated) {
        getOrCreateMutation.mutate({
          projectName: proj.name,
          projectType: proj.type,
          city: proj.city,
          data: newData,
        });
      }
    } else if (id === "custom") {
      setProjectData((prev) => ({ ...prev, projectName: "", projectType: "", city: "", projectImage: "", units: [emptyUnit()] }));
    }
  };
  const handleProjectSelect = (id: string) => {
    // تحذير عند التبديل إذا كانت هناك وحدات غير محفوظة
    if (activeBrochureId && !unitsSavedToDb && projectData.units.some(u => u.unitNumber || u.area || u.monthlyRent)) {
      setPendingProjectSwitch(id);
      return;
    }
    doProjectSelect(id);
  };

  const handleClearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProjectData({
      projectName: "", projectType: "", city: "", district: "",
      totalArea: "", floors: "", completionYear: "", description: "",
      amenities: "", contactName: "قسم التأجير - دلمون للاستثمار",
      contactPhone: "011-2080129", contactEmail: "info@delmoninvest.com",
      projectImage: "", units: [emptyUnit()],
    });
    setSelectedProjectId("");
    toast.success("تم مسح البيانات وبدء نموذج جديد");
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

  const handleExportExcel = () => {
    if (!projectData.projectName) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }
    // بيانات المشروع
    const projectSheet = [
      ["اسم المشروع", projectData.projectName],
      ["نوع المشروع", projectData.projectType],
      ["المدينة", projectData.city],
      ["الحي / الموقع", projectData.district],
      ["إجمالي المساحة (م²)", projectData.totalArea],
      ["عدد الطوابق", projectData.floors],
      ["سنة الإنجاز", projectData.completionYear],
      ["وصف المشروع", projectData.description],
      ["المرافق والخدمات", projectData.amenities],
      ["مسؤول التأجير", projectData.contactName],
      ["رقم التواصل", projectData.contactPhone],
      ["البريد الإلكتروني", projectData.contactEmail],
    ];
    // بيانات الوحدات
    const unitsHeader = ["رقم الوحدة", "الطابق", "المساحة (م²)", "نوع الوحدة", "الوصف", "المميزات", "السعر/م²", "الإيجار الشهري", "مدة العقد"];
    const unitsRows = projectData.units.map(u => [
      u.unitNumber, u.floor, u.area, u.unitType, u.description,
      u.features, u.pricePerMeter || "", u.monthlyRent || "", u.contractDuration || ""
    ]);
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.aoa_to_sheet(projectSheet);
    ws1["!cols"] = [{ wch: 25 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws1, "بيانات المشروع");
    const ws2 = XLSX.utils.aoa_to_sheet([unitsHeader, ...unitsRows]);
    ws2["!cols"] = unitsHeader.map(() => ({ wch: 18 }));
    XLSX.utils.book_append_sheet(wb, ws2, "الوحدات");
    XLSX.writeFile(wb, `${projectData.projectName} - بروشور التأجير.xlsx`);
    toast.success("✅ تم تصدير ملف Excel بنجاح!");
    trackEventMutation.mutate({
      eventType: "excel_export",
      projectName: projectData.projectName,
      projectType: projectData.projectType,
      city: projectData.city,
      unitsCount: projectData.units.length,
    });
  };

  const handleExportJSON = () => {
    if (!projectData.projectName) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }
    const backup = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      project: projectData,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectData.projectName} - نسخة احتياطية.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("✅ تم تصدير النسخة الاحتياطية بنجاح!");
    trackEventMutation.mutate({
      eventType: "json_export",
      projectName: projectData.projectName,
      projectType: projectData.projectType,
      city: projectData.city,
      unitsCount: projectData.units.length,
    });
  };

  const handleWhatsApp = () => {
    if (!projectData.projectName) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }
    const unitsSummary = projectData.units
      .slice(0, 5)
      .map(u => `• وحدة ${u.unitNumber || "—"} | ${u.area} م² | ${u.unitType}${u.monthlyRent ? ` | ${u.monthlyRent} ريال/شهر` : ""}`)
      .join("\n");
    const moreUnits = projectData.units.length > 5 ? `\n... و${projectData.units.length - 5} وحدة أخرى` : "";
    const msg = [
      `🏢 *${projectData.projectName}*`,
      projectData.projectType ? `📌 النوع: ${projectData.projectType}` : "",
      projectData.city ? `📍 المدينة: ${projectData.city}${projectData.district ? ` — ${projectData.district}` : ""}` : "",
      projectData.totalArea ? `📐 إجمالي المساحة: ${projectData.totalArea} م²` : "",
      projectData.floors ? `🏗️ عدد الطوابق: ${projectData.floors}` : "",
      "",
      projectData.description ? `📝 ${projectData.description}` : "",
      "",
      projectData.units.length > 0 ? `*الوحدات المتاحة (${projectData.units.length}):*\n${unitsSummary}${moreUnits}` : "",
      "",
      projectData.amenities ? `✅ المرافق: ${projectData.amenities}` : "",
      "",
      projectData.contactName ? `👤 مسؤول التأجير: ${projectData.contactName}` : "",
      projectData.contactPhone ? `📞 ${projectData.contactPhone}` : "",
      projectData.contactEmail ? `✉️ ${projectData.contactEmail}` : "",
    ].filter(Boolean).join("\n");
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleExportPDF = async () => {
    if (!projectData.projectName) {
      toast.error("يرجى إدخال اسم المشروع أولاً");
      return;
    }
    // التحقق من البيانات وعرض التحذيرات إذا وجدت
    const warnings = buildValidationWarnings();
    if (warnings.length > 0) {
      setValidationWarnings(warnings);
      setShowValidationDialog(true);
      return;
    }
    await doExportPDF();
  };

  const doExportPDF = async () => {
    setIsGenerating(true);
    setExportDone(false);
    setExportStep("جاري تجهيز البروشور...");
    try {
      await new Promise((r) => setTimeout(r, 200));
      setExportStep("جاري معالجة الصفحات...");
      // Server-side PDF via Puppeteer (avoids CORS/html2canvas issues)
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: projectData, template: selectedTemplate }),
        credentials: "include",
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error((errBody as any).error || `HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const pName = projectData.projectName || "بروشور-دلمون";
      const pCity = projectData.city ? `-${projectData.city}` : "";
      const pDate = new Date().toISOString().split("T")[0];
      a.href = blobUrl;
      a.download = `بروشور-دلمون-${pName}${pCity}-${pDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      setExportStep("تم بنجاح!");
      setExportDone(true);
      toast.success("✅ تم تصدير البروشور بنجاح!");
      setTimeout(() => { setExportDone(false); setExportStep(""); }, 3000);
      trackEventMutation.mutate({
        eventType: "pdf_export",
        template: selectedTemplate,
        projectName: projectData.projectName,
        projectType: projectData.projectType,
        city: projectData.city,
        unitsCount: projectData.units.length,
      });
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
  // ── Completion percentage ──────────────────────────────────────────────
  // حقول المشروع الأساسية (4 حقول)
  const projectFields = [
    projectData.projectName,
    projectData.projectType,
    projectData.city,
    projectData.description,
  ].filter(Boolean).length;

  // حقول الوحدات المالية: كل وحدة يجب أن تحتوي على area > 0 و monthlyRent > 0 و unitType
  const hasUnits = projectData.units.length > 0;
  const unitsComplete = hasUnits
    ? projectData.units.every(
        (u) =>
          parseFloat(u.area) > 0 &&
          parseFloat(String(u.monthlyRent).replace(/,/g, "")) > 0 &&
          u.unitType
      )
    : false;

  // الوزن: 4 حقول مشروع (50%) + وحدات مكتملة (50%)
  const projectScore = (projectFields / 4) * 50;
  const unitsScore = hasUnits
    ? (projectData.units.filter(
        (u) =>
          parseFloat(u.area) > 0 &&
          parseFloat(String(u.monthlyRent).replace(/,/g, "")) > 0 &&
          u.unitType
      ).length /
        projectData.units.length) *
      50
    : 0;
  const completionPct = Math.round(projectScore + unitsScore);
  const unitsWithArea = projectData.units.filter((u) => u.area).length;

  // حقول الجاهزية الأساسية للبروشور التسويقي؛ التسعير اختياري في العرض
  const incompleteUnitIds = new Set(
    projectData.units
      .filter(
        (u) =>
          !(
            u.unitNumber &&
            parseFloat(u.area) > 0 &&
            u.unitType &&
            u.description
          )
      )
      .map((u) => u.id)
  );

  return (
    <>
    {/* حوار التحذير عند التبديل بين المشاريع مع وجود وحدات غير محفوظة */}
    <AlertDialog open={!!pendingProjectSwitch} onOpenChange={(open) => { if (!open) setPendingProjectSwitch(null); }}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            تعديلات غير محفوظة
          </AlertDialogTitle>
          <AlertDialogDescription>
            لديك وحدات لم تُحفظ بعد في قاعدة البيانات. إذا انتقلت الآن ستفقد هذه التعديلات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogAction
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => {
              if (pendingProjectSwitch) {
                doProjectSelect(pendingProjectSwitch);
                setPendingProjectSwitch(null);
              }
            }}
          >
            انتقل بدون حفظ
          </AlertDialogAction>
          <AlertDialogCancel onClick={() => setPendingProjectSwitch(null)}>
            ابقَ وأكمل التعديل
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <div className="min-h-screen bg-[#F7F7F4] flex flex-col md:flex-row-reverse" dir="rtl">
      {/* ===== MOBILE HEADER (visible only on small screens) ===== */}
      <header className="md:hidden bg-white shadow-md sticky top-0 z-50 border-b-2 border-[#949437]/40 w-full">
        <div className="px-4 flex items-center justify-between py-3">
          <img src="/manus-storage/delmon_logo_official_81df30cc.png" alt="دلمون للاستثمار" className="h-9 w-auto object-contain" />
          <div className="text-[#2C2C2C] font-bold text-sm">نظام بروشور التأجير</div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowPreview(true)} variant="outline" size="sm" className="border-[#8fa9dc]/60 text-[#555555] px-2">
              <Eye className="w-4 h-4" />
            </Button>
            <Button onClick={handleExportPDF} disabled={isGenerating} size="sm" className="bg-[#949437] hover:bg-[#7a7a2e] text-white font-bold px-2">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-[#D0D0D0]">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {isAuthenticated && user ? (
                  <>
                    <DropdownMenuItem className="text-xs text-[#949437] font-medium cursor-default">
                      <User className="w-3.5 h-3.5 ml-1" />{user.name || user.email || "مستخدم"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : !loading ? (
                  <>
                    <DropdownMenuItem onClick={() => startLogin()}>
                      <LogIn className="w-3.5 h-3.5 ml-1" />تسجيل الدخول
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : null}
                <DropdownMenuItem onClick={() => setLocation("/archive")}><Archive className="w-3.5 h-3.5 ml-1" />الأرشيف</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveToArchive} disabled={saveBrochureMutation.isPending || !isAuthenticated}><Save className="w-3.5 h-3.5 ml-1" />حفظ في الأرشيف</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClearDraft}><RotateCcw className="w-3.5 h-3.5 ml-1" />مسح البيانات</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}><TableProperties className="w-3.5 h-3.5 ml-1" />تصدير Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}><Download className="w-3.5 h-3.5 ml-1" />نسخ احتياطي JSON</DropdownMenuItem>
                {isAuthenticated && user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-red-500"><LogOut className="w-3.5 h-3.5 ml-1" />تسجيل الخروج</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT (offset for sidebar on desktop) ===== */}
      <div className="delmon-workspace flex-1 w-full md:mr-44 min-w-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <section className="relative mb-5 overflow-hidden border border-[#262626] bg-[#262626] px-5 py-5 text-white md:px-7 md:py-6">
          <div className="absolute -left-10 -top-12 h-40 w-40 border border-[#94B6D2]/45" />
          <div className="absolute bottom-4 left-4 h-20 w-20 border border-[#949437]/75" />
          <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-2 text-[11px] font-extrabold tracking-[0.16em] text-[#B2CBE0]">DELMON LEASING STUDIO</div>
              <h1 className="text-xl font-black leading-tight md:text-2xl">حوّل بيانات الوحدة إلى بروشور تأجيري جاهز للمشاركة</h1>
              <p className="mt-2 text-xs leading-6 text-white/70 md:text-sm">أدخل حقائق المشروع والوحدة، راجع المعاينة، ثم أرسل ملفاً تسويقياً متسقاً مع هوية دلمون.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
              <span className="border border-[#94B6D2]/70 bg-white/5 px-3 py-1.5 text-[#dcebf5]">هوية دلمون المعتمدة</span>
              <span className="border border-[#949437]/80 bg-[#949437]/10 px-3 py-1.5 text-[#eef0dc]">معاينة قبل الإرسال</span>
              <span className="border border-white/20 bg-white/5 px-3 py-1.5 text-white/75">PDF جاهز للتسويق</span>
            </div>
          </div>
        </section>
        {/* ===== STATS BAR ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
           { label: "الفرص المتاحة", value: String(projectData.units.length), icon: Building2 },
            { label: "المساحة المتاحة", value: totalArea > 0 ? `${formatNumber(totalArea)} م²` : "0 م²", icon: MapPin },
           { label: "المشروع", value: projectData.projectName || "—", icon: Building2 },
            { label: "جاهزية البروشور", value: `${completionPct}%`, icon: LayoutList },
          ].map((stat, i) => (
            <div key={i} className="delmon-panel flex items-center gap-3 overflow-hidden p-4 transition-all hover:-translate-y-0.5 hover:border-[#94B6D2]">
              <div className="h-10 w-10 flex-shrink-0 border border-[#94B6D2]/70 bg-[#edf4fa] flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-[#6f96b8]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-gray-500 font-medium">{stat.label}</div>
                <div className="font-black text-[#2C2C2C] text-base truncate" title={stat.value}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ===== FORM PANEL ===== */}
          <div className="delmon-panel lg:col-span-3 order-2 lg:order-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#E2E5E3] bg-[#F7F7F4]">
              {[
                { id: "project", label: "بيانات المشروع" },
                { id: "units", label: `الوحدات (${projectData.units.length})` },
                { id: "contact", label: "معلومات التواصل" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "text-[#262626] border-[#949437] bg-white font-extrabold"
                      : "text-gray-400 border-transparent hover:text-[#262626] hover:bg-white/60"
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
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <ProjectTab projectData={projectData} updateProject={updateProject} />
                </div>
              )}
                            {/* ---- UNITS TAB ---- */}
              {activeTab === "units" && (
                <UnitsTab
                  units={projectData.units}
                  addUnit={addUnit}
                  removeUnit={removeUnit}
                  updateUnit={updateUnit}
                  incompleteUnitIds={incompleteUnitIds}
                />
              )}
              {/* ---- CONTACT TAB ---- */}
              {activeTab === "contact" && (
                <ContactTab projectData={projectData} updateProject={updateProject} />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-[#E2E5E3] bg-[#F7F7F4] px-6 py-4">
              <Button
                onClick={handleExportPDF}
                disabled={isGenerating}
                className="flex-1 bg-[#949437] hover:bg-[#7a7a2e] text-white font-bold"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : exportDone ? (
                  <CheckCircle2 className="w-4 h-4 ml-2 text-green-400" />
                ) : (
                  <FileDown className="w-4 h-4 ml-2" />
                )}
                {isGenerating ? exportStep : exportDone ? "تم تجهيز البروشور" : "تصدير بروشور تسويقي PDF"}
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
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#D0D0D0] overflow-hidden sticky top-24 flex flex-col">
              <div className="bg-[#949437] px-4 py-3 flex items-center justify-between">
                <span className="text-white text-sm font-semibold">معاينة البروشور</span>
                <button
                  onClick={() => setShowPreview(true)}
                  className="text-white/80 text-xs hover:text-white hover:underline"
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
              {/* Template Selector */}
              <div className="px-4 py-3 border-b border-[#E8E8E4] bg-[#FAFAF8]">
                <div className="text-[10px] text-gray-400 mb-2 font-medium">اختر قالب البروشور:</div>
                <TemplateSelector selected={selectedTemplate} onChange={handleTemplateChange} />
              </div>
              <div className="p-3 bg-[#F0F3FA] overflow-hidden" style={{ maxHeight: "calc(100vh - 230px)" }}>
                <div
                  className="origin-top-right scale-[0.45] w-[222%] pointer-events-none"
                  style={{ transformOrigin: "top right" }}
                >
                  <ActivePreview data={debouncedProjectData} />
                </div>
              </div>
              {/* Units counter */}
              <div className="px-4 py-2 border-t border-[#D0D0D0] bg-white flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {unitsWithArea}/{projectData.units.length} وحدة مكتملة البيانات
                </span>
                <span className="text-xs font-bold text-[#2C2C2C]">
                  {totalArea > 0 ? `${formatNumber(totalArea)} م²` : "أدخل المساحات"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>{/* end flex-1 wrapper */}

      {/* ===== RIGHT SIDEBAR (desktop only) ===== */}
      <aside className="hidden md:flex flex-col w-44 bg-white border-l-2 border-[#949437]/30 shadow-lg fixed right-0 top-0 bottom-0 z-40 overflow-y-auto">
        <div className="flex flex-col items-center gap-1 py-4 px-3 border-b border-[#949437]/20 bg-[#FAFAF8]">
          <img src="/manus-storage/delmon_logo_official_81df30cc.png" alt="دلمون للاستثمار" className="h-9 w-auto object-contain" />
          <div className="text-[9px] text-[#949437] font-semibold tracking-wider text-center leading-tight mt-1">نظام بروشور التأجير</div>
        </div>
        <div className="px-3 py-2 border-b border-[#E8E8E4]">
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#949437] flex-shrink-0" /><span className="text-[10px] text-[#2C2C2C] font-medium truncate">{user.name || user.email || "مستخدم"}</span></div>
              <button onClick={() => logout()} className="flex items-center gap-1.5 text-[10px] text-red-400 hover:text-red-600 transition-colors w-full text-right"><LogOut className="w-3 h-3 flex-shrink-0" />تسجيل الخروج</button>
            </div>
          ) : !loading ? (
            <button onClick={() => startLogin()} className="flex items-center gap-1.5 text-[11px] text-[#949437] hover:text-[#7a7a2e] font-semibold transition-colors w-full"><LogIn className="w-3.5 h-3.5 flex-shrink-0" />تسجيل الدخول</button>
          ) : null}
        </div>
        <nav className="flex flex-col gap-1 p-2 flex-1">
          <button onClick={handleExportPDF} disabled={isGenerating} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-[#949437] hover:bg-[#7a7a2e] text-white font-bold text-xs transition-all shadow-sm disabled:opacity-60">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : <FileDown className="w-4 h-4 flex-shrink-0" />}
            <span className="truncate">{isGenerating ? exportStep : "تصدير PDF"}</span>
          </button>
          <button onClick={() => setShowPreview(true)} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-[#8fa9dc]/60 text-[#555555] hover:border-[#949437] hover:text-[#949437] text-xs transition-all bg-transparent"><Eye className="w-4 h-4 flex-shrink-0" /><span>معاينة</span></button>
          <div className="h-px bg-[#E8E8E4] my-1" />
          <button onClick={() => setLocation("/archive")} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-[#8fa9dc]/40 text-[#555555] hover:border-[#949437] hover:text-[#949437] text-xs transition-all bg-transparent"><Archive className="w-4 h-4 flex-shrink-0" /><span>الأرشيف</span></button>
          <button onClick={handleSaveToArchive} disabled={saveBrochureMutation.isPending || !isAuthenticated} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-green-300/60 text-green-600 hover:border-green-500 hover:bg-green-50 text-xs transition-all bg-transparent disabled:opacity-50">
            {saveBrochureMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : <Save className="w-4 h-4 flex-shrink-0" />}
            <span>حفظ في الأرشيف</span>
          </button>
          <button onClick={handleClearDraft} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-red-200 text-red-400 hover:border-red-400 hover:text-red-600 text-xs transition-all bg-transparent"><RotateCcw className="w-4 h-4 flex-shrink-0" /><span>مسح</span></button>
          <div className="h-px bg-[#E8E8E4] my-1" />
          <button onClick={handleExportExcel} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-[#2e7d32]/40 text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white text-xs transition-all font-bold"><TableProperties className="w-4 h-4 flex-shrink-0" /><span>Excel</span></button>
          <button onClick={handleExportJSON} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-[#5c6bc0]/40 text-[#5c6bc0] hover:bg-[#5c6bc0] hover:text-white text-xs transition-all font-bold"><Download className="w-4 h-4 flex-shrink-0" /><span>JSON</span></button>
          <button onClick={handleWhatsApp} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white text-xs transition-all font-bold"><MessageCircle className="w-4 h-4 flex-shrink-0" /><span>واتساب</span></button>
          <button onClick={() => setLocation("/ai-generator")} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-[#1a2744] hover:bg-[#2a3a6a] text-white text-xs transition-all font-bold shadow-sm border border-[#c9a84c]/40"><Sparkles className="w-4 h-4 text-[#c9a84c] flex-shrink-0" /><span>توليد AI</span></button>
        </nav>
        <div className="px-3 py-2 border-t border-[#949437]/10 bg-[#949437]/5 flex items-center gap-1.5"><Save className="w-3 h-3 text-[#949437] flex-shrink-0" /><span className="text-[9px] text-[#949437]/80 leading-tight">حفظ تلقائي</span></div>
          {!isAuthenticated ? (
            <div className="text-[9px] text-center px-2 py-1 text-amber-500 leading-tight">
              ⚠️ سجّل دخولك لتفعيل الحفظ الدائم
            </div>
          ) : activeBrochureId ? (
            <div className={`text-[9px] text-center px-2 py-1 rounded leading-tight ${unitsSavedToDb ? "text-green-500" : "text-amber-400"}`}>
              {unitsSavedToDb ? "✓ محفوظ في قاعدة البيانات" : "⏳ جاري الحفظ..."}
            </div>
          ) : isAuthenticated && projectData.projectName ? (
            <div className="text-[9px] text-center px-2 py-1 text-blue-400 leading-tight">
              🔄 جاري ربط المشروع...
            </div>
          ) : (
            <div className="text-[9px] text-center px-2 py-1 text-[#949437]/50 leading-tight">
              أدخل اسم المشروع للبدء
            </div>
          )}
      </aside>

      {/* ===== FULL PREVIEW MODAL ===== */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-8"
          onClick={(e) => e.target === e.currentTarget && setShowPreview(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-[860px] w-full mx-4 overflow-hidden">
            <div className="bg-[#949437] px-6 py-4 flex items-center justify-between">
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
              <ActivePreview data={debouncedProjectData} />
            </div>
          </div>
          </div>
        </div>
      )}
      {/* ===== VALIDATION WARNING DIALOG ===== */}
      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent dir="rtl" className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              تنبيه: بيانات غير مكتملة
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-3">
                  تم اكتشاف المشاكل التالية في البروشور. يمكنك المتابعة والتصدير على أي حال، أو العودة لتصحيح البيانات:
                </p>
                <ul className="space-y-2">
                  {validationWarnings.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2 sm:flex-row-reverse">
            <AlertDialogCancel className="flex-1 border-[#949437] text-[#949437] hover:bg-[#949437]/10">
              إلغاء وتصحيح البيانات
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => {
                setShowValidationDialog(false);
                doExportPDF();
              }}
            >
              متابعة التصدير على أي حال
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
}
