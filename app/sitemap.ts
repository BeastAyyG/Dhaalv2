import { MetadataRoute } from "next";
import { CURRENT_DOMAIN } from "@/lib/url-config";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = CURRENT_DOMAIN;

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "always",
            priority: 1,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        // Add other public routes here
    ];
}
