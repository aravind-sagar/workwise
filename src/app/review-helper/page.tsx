import { ReviewHelperClient } from "@/components/review-helper/review-helper-client";

export default function ReviewHelperPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Review Helper</h2>
            </div>
            <div className="max-w-2xl mx-auto">
                <ReviewHelperClient />
            </div>
        </div>
    )
}
