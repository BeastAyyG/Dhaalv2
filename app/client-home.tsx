"use client";

import { useState, useRef, useCallback } from "react";
import { MapView } from "@/components/map";
import { ReportCard } from "@/components/feed/report-card";
import { NewReportModal } from "@/components/feed/new-report-modal";
import { Plus, Map as MapIcon, List, TrendingUp, AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { SkeletonCard } from "@/components/ui/badges";
import { EmergencyAlertBanner } from "@/components/emergency-alert-banner";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ClientHomeProps {
  reports: Report[];
}

export default function ClientHome({ reports }: ClientHomeProps) {
  const [viewMode, setViewMode] = useState<"map" | "feed">("feed");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading] = useState(false);

  // Swipe handling
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && viewMode === "feed") {
        setViewMode("map");
      } else if (diff < 0 && viewMode === "map") {
        setViewMode("feed");
      }
    }
  }, [viewMode]);

  const defaultCenter: [number, number] = [12.9716, 77.5946];
  const categories = [...new Set(reports.map(r => r.category))];
  const emergencies = reports.filter(r => r.severity >= 9);

  const filteredReports = selectedCategory
    ? reports.filter(r => r.category === selectedCategory)
    : reports;

  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === "OPEN").length,
    inProgress: reports.filter(r => r.status === "IN_PROGRESS").length,
    resolved: reports.filter(r => r.status === "RESOLVED").length,
  };

  const handleLocateReport = () => {
    setViewMode("map");
  };

  return (
    <div className="bg-[var(--bg-deep)] pb-24 md:pb-8">
      {/* Emergency Banner */}
      {emergencies.length > 0 && (
        <div className="mb-6">
          <EmergencyAlertBanner emergencies={emergencies} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-1">
            Community <span className="gradient-text">Reports</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Empowering citizens to build better cities
          </p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" aria-label="Report statistics">
          <div className="glass-card-static p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--info-bg)] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[var(--info)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl font-semibold font-mono text-[var(--text-primary)]">{stats.total}</div>
                <div className="text-[11px] text-[var(--text-subtle)]">Total</div>
              </div>
            </div>
          </div>

          <div className="glass-card-static p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--warning-bg)] flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-[var(--warning)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl font-semibold font-mono text-[var(--warning)]">{stats.open}</div>
                <div className="text-[11px] text-[var(--text-subtle)]">Open</div>
              </div>
            </div>
          </div>

          <div className="glass-card-static p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--info-bg)] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[var(--info)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl font-semibold font-mono text-[var(--info)]">{stats.inProgress}</div>
                <div className="text-[11px] text-[var(--text-subtle)]">Progress</div>
              </div>
            </div>
          </div>

          <div className="glass-card-static p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--success-bg)] flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[var(--success)]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl font-semibold font-mono text-[var(--success)]">{stats.resolved}</div>
                <div className="text-[11px] text-[var(--text-subtle)]">Resolved</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Swipe Tab Pills */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)]">
            <button
              onClick={() => setViewMode("feed")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                viewMode === "feed"
                  ? "bg-[var(--brand)] text-white shadow-lg"
                  : "text-[var(--text-muted)]"
              )}
            >
              <List className="w-5 h-5" />
              Feed
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                viewMode === "map"
                  ? "bg-[var(--brand)] text-white shadow-lg"
                  : "text-[var(--text-muted)]"
              )}
            >
              <MapIcon className="w-5 h-5" />
              Map
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-[var(--text-subtle)] text-xs">
            <ChevronLeft className="w-3 h-3" />
            <span>Swipe to switch</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div
            className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)]"
            role="tablist"
          >
            <button
              onClick={() => setViewMode("feed")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === "feed"
                  ? "bg-[var(--brand)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
              role="tab"
              aria-selected={viewMode === "feed"}
            >
              <List className="w-4 h-4" />
              Feed
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === "map"
                  ? "bg-[var(--brand)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
              role="tab"
              aria-selected={viewMode === "map"}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                !selectedCategory
                  ? "bg-[var(--brand)] text-white border-transparent"
                  : "bg-transparent border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--brand)]"
              )}
            >
              All
            </button>
            {categories.slice(0, 4).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                  selectedCategory === cat
                    ? "bg-[var(--brand)] text-white border-transparent"
                    : "bg-transparent border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--brand)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content (Swipeable) */}
        <div
          ref={containerRef}
          className="md:hidden relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={cn(
              "flex transition-transform duration-300 ease-out",
              viewMode === "map" ? "-translate-x-full" : "translate-x-0"
            )}
            style={{ width: "200%" }}
          >
            <div className="w-1/2 pr-2">
              <div className="space-y-4">
                {isLoading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : filteredReports.length === 0 ? (
                  <div className="glass-card-static p-8 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--info-bg)] flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-[var(--info)]" />
                    </div>
                    <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">No Reports Yet</h3>
                    <p className="text-[var(--text-muted)] text-sm mb-4">
                      Be the first to report an issue in your area
                    </p>
                    <button onClick={() => setIsReportModalOpen(true)} className="btn-cta">
                      Create Report
                    </button>
                  </div>
                ) : (
                  filteredReports.map((report, index) => (
                    <div key={report.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <ReportCard report={report} onLocate={handleLocateReport} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="w-1/2 pl-2">
              <div className="h-[450px] rounded-xl overflow-hidden glass-card-static p-0">
                <MapView
                  reports={filteredReports}
                  center={defaultCenter}
                  onMarkerClick={handleLocateReport}
                  isVisible={viewMode === "map"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Content Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-5">
          <div className={cn("h-[550px] rounded-xl overflow-hidden glass-card-static p-0", viewMode === "feed" && "hidden md:block")}>
            <MapView
              reports={filteredReports}
              center={defaultCenter}
              onMarkerClick={handleLocateReport}
              isVisible={viewMode === "map"}
            />
          </div>

          <div className={cn("space-y-4", viewMode === "map" && "hidden md:block")}>
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : filteredReports.length === 0 ? (
              <div className="glass-card-static p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--info-bg)] flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-[var(--info)]" />
                </div>
                <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">No Reports Yet</h3>
                <p className="text-[var(--text-muted)] text-sm mb-4">
                  Be the first to report an issue in your area
                </p>
                <button onClick={() => setIsReportModalOpen(true)} className="btn-cta">
                  Create Report
                </button>
              </div>
            ) : (
              filteredReports.map((report, index) => (
                <div key={report.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <ReportCard report={report} onLocate={handleLocateReport} />
                </div>
              ))
            )}
          </div>
        </div>

        <NewReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-6 md:right-8 w-14 h-14 rounded-xl btn-cta shadow-xl z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <WhatsAppButton />
    </div>
  );
}
