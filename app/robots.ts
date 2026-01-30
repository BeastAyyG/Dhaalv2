import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/officer/", "/profile/"],
        },
        sitemap: "https://dhaal.vercel.app/sitemap.xml",
    };
}
