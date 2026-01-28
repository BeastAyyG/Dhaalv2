export type User = {
    id: string;
    phone: string;
    points: number;
    badges: string[];
    is_officer: boolean;
    avatar_url?: string;
};

export type ReportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export type Report = {
    id: string;
    user_id: string;
    category: string;
    severity: number;
    description: string;
    lat: number;
    lng: number;
    image_url: string;
    status: ReportStatus;
    upvotes: number;
    created_at: string;
    // UI specific
    distance?: number;
};

export type AnalysisResult = {
    category: string;
    severityScore: number;
    description: string;
};
