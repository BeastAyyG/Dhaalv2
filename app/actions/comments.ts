"use server";

export interface Comment {
    id: string;
    report_id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
}

// Mock comments store (in production, this would be from database)
const mockComments: Comment[] = [
    {
        id: "c1",
        report_id: "1",
        user_id: "mock-user-1",
        user_name: "Rahul S.",
        content: "This has been an issue for weeks! Glad someone reported it.",
        created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: "c2",
        report_id: "1",
        user_id: "mock-user-2",
        user_name: "Priya M.",
        content: "I saw the municipal workers checking this yesterday.",
        created_at: new Date(Date.now() - 1800000).toISOString(),
    },
];

export async function getCommentsAction(reportId: string): Promise<Comment[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return mockComments.filter(c => c.report_id === reportId);
}

export async function addCommentAction(formData: FormData): Promise<{ success: boolean; comment?: Comment; error?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const reportId = formData.get("reportId") as string;
    const content = formData.get("content") as string;
    const userName = formData.get("userName") as string || "Anonymous";

    if (!reportId || !content) {
        return { success: false, error: "Missing required fields" };
    }

    const newComment: Comment = {
        id: `c-${Date.now()}`,
        report_id: reportId,
        user_id: "anonymous",
        user_name: userName,
        content,
        created_at: new Date().toISOString(),
    };

    mockComments.push(newComment);
    return { success: true, comment: newComment };
}
