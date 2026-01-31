import { MetadataRoute } from "next";
import { CURRENT_DOMAIN } from "@/lib/url-config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/officer/", "/profile/"],
        },
        sitemap: `${CURRENT_DOMAIN}/sitemap.xml`,
    };
}
