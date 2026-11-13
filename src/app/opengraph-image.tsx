import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getProfile } from "@/lib/content/content";
import { initialsOf } from "@/lib/utils/initials";

/*
 * The preview shown when a link to the site is shared, on every page. Colours
 * copy the light theme in globals.css, since an image can't read CSS.
 */
const COLOURS = {
    background: "#fbf9f4",
    foreground: "#1c1b19",
    primary: "#0f766e",
    primaryForeground: "#ffffff",
};

const SIZE = { width: 1200, height: 630 };

/**
 * The site's Source Serif 4, read once as the Next.js docs show. next/font
 * only serves .woff2 to browsers, which the image renderer can't read.
 */
const fontFile = (name: string) =>
    readFile(join(process.cwd(), "assets/fonts", name));
const [regular, semibold] = await Promise.all([
    fontFile("source-serif-4-regular.woff"),
    fontFile("source-serif-4-semibold.woff"),
]);
const FONTS = [
    { name: "Source Serif", data: regular, weight: 400 as const },
    { name: "Source Serif", data: semibold, weight: 600 as const },
];

/** One image. Generated so its alt text can come from the content. */
const generateImageMetadata = async () => {
    const profile = await getProfile();
    return [
        {
            id: "site",
            alt: `${profile.name}: ${profile.tagline}`,
            size: SIZE,
            contentType: "image/png",
        },
    ];
};

const OpenGraphImage = async () => {
    const profile = await getProfile();
    return new ImageResponse(
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
                padding: 80,
                background: COLOURS.background,
                color: COLOURS.foreground,
                fontFamily: "Source Serif",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 112,
                    height: 112,
                    borderRadius: 24,
                    background: COLOURS.primary,
                    color: COLOURS.primaryForeground,
                    fontSize: 48,
                    fontWeight: 600,
                }}
            >
                {initialsOf(profile.name)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ fontSize: 80, fontWeight: 600 }}>
                    {profile.name}
                </div>
                <div style={{ fontSize: 36, lineHeight: 1.4, opacity: 0.7 }}>
                    {profile.tagline}
                </div>
            </div>
            <div style={{ fontSize: 30, color: COLOURS.primary }}>
                {new URL(profile.url).host}
            </div>
        </div>,
        { ...SIZE, fonts: FONTS },
    );
};

export { generateImageMetadata };
export default OpenGraphImage;
