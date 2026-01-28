"use client";

import { useState, useRef } from "react";
import { MapView } from "@/components/map";
import { ReportCard } from "@/components/feed/report-card";
import { NewReportModal } from "@/components/feed/new-report-modal";
import { Header } from "@/components/ui/header";
import { Plus, Map as MapIcon, List, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ClientHomeProps {
  reports: Report[];
}

export default function ClientHome({ reports }: ClientHomeProps) {
  const [viewMode, setViewMode] = useState<"map" | "feed">("feed");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  // Default Center (Bangalore)
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  // Get unique categories
  const categories = [...new Set(reports.map(r => r.category))];

  // Filter reports
  const filteredReports = selectedCategory
    ? reports.filter(r => r.category === selectedCategory)
    : reports;

  // Stats
  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === "OPEN").length,
    inProgress: reports.filter(r => r.status === "IN_PROGRESS").length,
    resolved: reports.filter(r => r.status === "RESOLVED").length,
  };

  const handleLocateReport = (report: Report) => {
    setViewMode("map");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-24 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4">

          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Community <span className="gradient-text">Reports</span>
            </h1>
            <p className="text-[var(--text-muted)]">
              Empowering citizens to build better cities
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="glass-card p-4 hover-lift cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[var(--brand-light)]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</div>
                  <div className="text-xs text-[var(--text-muted)]">Total Reports</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 hover-lift cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--warning-bg)] flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-[var(--warning)]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--warning)]">{stats.open}</div>
                  <div className="text-xs text-[var(--text-muted)]">Open</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 hover-lift cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--brand-light)]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--brand-light)]">{stats.inProgress}</div>
                  <div className="text-xs text-[var(--text-muted)]">In Progress</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 hover-lift cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--success-bg)] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--success)]">{stats.resolved}</div>
                  <div className="text-xs text-[var(--text-muted)]">Resolved</div>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle & Filters */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)]">
              <button
                onClick={() => setViewMode("feed")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  viewMode === "feed"
                    ? "bg-[var(--brand)] text-white shadow-lg"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <List className="w-4 h-4" />
                Feed
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  viewMode === "map"
                    ? "bg-[var(--brand)] text-white shadow-lg"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <MapIcon className="w-4 h-4" />
                Map
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                  !selectedCategory
                    ? "bg-[var(--brand)] text-white border-transparent shadow-lg"
                    : "bg-transparent border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--brand)]/50 hover:text-[var(--text-primary)]"
                )}
              >
                All
              </button>
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                    selectedCategory === cat
                      ? "bg-[var(--brand)] text-white border-transparent shadow-lg"
                      : "bg-transparent border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--brand)]/50 hover:text-[var(--text-primary)]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Left: Map */}
            <div className={cn(
              "h-[400px] md:h-[600px] rounded-2xl overflow-hidden glass-card-static p-0",
              viewMode === "feed" && "hidden md:block"
            )}>
              <MapView
                reports={filteredReports}
                center={defaultCenter}
                onMarkerClick={handleLocateReport}
              />
            </div>

            {/* Right: Feed */}
            <div className={cn(
              "space-y-4",
              viewMode === "map" && "hidden md:block"
            )}>
              {filteredReports.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-[var(--brand-light)]" />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2">No Reports Yet</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-4">
                    Be the first to report an issue in your area!
                  </p>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="btn-primary"
                  >
                    Create Report
                  </button>
                </div>
              ) : (
                filteredReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ReportCard
                      report={report}
                      onLocate={handleLocateReport}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--gradient-brand)] shadow-xl flex items-center justify-center z-50 animate-pulse-glow hover-lift active-scale"
      >
        <Plus className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card-static rounded-t-2xl rounded-b-none border-b-0">
        <div className="flex items-center justify-around h-16 px-4">
          <button
            onClick={() => setViewMode("feed")}
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors py-2 px-4 rounded-xl",
              viewMode === "feed"
                ? "text-[var(--brand-light)] bg-[var(--brand)]/10"
                : "text-[var(--text-muted)]"
            )}
          >
            <List className="w-5 h-5" />
            Feed
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium transition-colors py-2 px-4 rounded-xl",
              viewMode === "map"
                ? "text-[var(--brand-light)] bg-[var(--brand)]/10"
                : "text-[var(--text-muted)]"
            )}
          >
            <MapIcon className="w-5 h-5" />
            Map
          </button>
          <a
            href="/analytics"
            className="flex flex-col items-center gap-1 text-xs font-medium text-[var(--text-muted)] py-2 px-4 rounded-xl"
          >
            <TrendingUp className="w-5 h-5" />
            Stats
          </a>
        </div>
      </nav>

      {/* Report Modal */}
      <NewReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
