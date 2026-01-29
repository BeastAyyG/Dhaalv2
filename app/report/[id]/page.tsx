import { getReportByIdAction } from "@/app/actions/get-report";
import { getCommentsAction } from "@/app/actions/comments";
import ReportDetailClient from "./report-detail-client";
import { notFound } from "next/navigation";

interface ReportPageProps {
    params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
    const { id } = await params;

    const report = await getReportByIdAction(id);

    if (!report) {
        notFound();
    }

    const comments = await getCommentsAction(id);

    return <ReportDetailClient report={report} initialComments={comments} />;
}
