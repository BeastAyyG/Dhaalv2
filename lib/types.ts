export type UserRole = 'citizen' | 'official' | 'admin';

export type User = {
    id: string;
    phone: string;
    name?: string;
    xp: number; // Changed from points to match DB
    level: number;
    badges: string[];
    role: UserRole; // Added role
    is_officer?: boolean; // Keep for backward compat, but prefer checkRole()
    avatar_url?: string;
    created_at?: string;
};

export type ReportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type ReportPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type Report = {
    id: string;
    user_id: string;
    category: string;
    severity: number;
    description: string;
    lat: number;
    lng: number;
    image_url: string;
    image_hash?: string;
    status: ReportStatus;
    priority?: ReportPriority;
    officer_id?: string;
    upvotes: number;
    created_at: string;
    // UI specific
    distance?: number;
    location?: string; // Optional human-readable location
    date?: string; // Optional formatted date
};

export type ReportAssignment = {
    id: string;
    report_id: string;
    officer_id: string;
    assigned_at: string;
    status: 'ACTIVE' | 'COMPLETED' | 'TRANSFERRED';
};

export type ReportUpdateType = 'progress' | 'resolution' | 'note';

export type ReportUpdate = {
    id: string;
    report_id: string;
    officer_id: string;
    image_url?: string;
    description?: string;
    type: ReportUpdateType;
    created_at: string;
    // UI specific join fields
    officer_name?: string;
    officer_avatar?: string;
};

export type AnalysisResult = {
    category: string;
    severityScore: number;
    description: string;
    priority?: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
    isEmergency?: boolean;
};

import { type LucideIcon } from "lucide-react";

export type Badge = {
    id: string;
    name: string;
    icon: LucideIcon; // Lucide icon
    description: string;
    earned: boolean;
};

export type Level = {
    level: number;
    name: string;
    minXp: number;
    maxXp?: number; // Added optional max for progress calculation
};
