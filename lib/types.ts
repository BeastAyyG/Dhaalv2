export type User = {
    id: string;
    phone: string;
    name?: string;
    xp: number; // Changed from points to match DB
    level: number;
    badges: string[];
    is_officer?: boolean;
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

export type AnalysisResult = {
    category: string;
    severityScore: number;
    description: string;
};

export type Badge = {
    id: string;
    name: string;
    icon: any; // Lucide icon
    description: string;
    earned: boolean;
};

export type Level = {
    level: number;
    name: string;
    minXp: number;
};
