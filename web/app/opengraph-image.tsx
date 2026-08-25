import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
    "CourseCatch — a shadow waitlist for SFU course enrollment";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "80px",
                    backgroundColor: "#0c0c0d",
                    color: "#fafafa",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex" }}>
                    <svg width="96" height="96" viewBox="0 0 32 32">
                        <path
                            d="M19.59 9.45 A 8 8 0 1 0 19.59 22.55"
                            fill="none"
                            stroke="#fafafa"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                        />
                        <circle cx="23.2" cy="16" r="3.4" fill="#34d399" />
                    </svg>
                </div>
                <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: "-2px", marginTop: 40 }}>
                    CourseCatch
                </div>
                <div style={{ display: "flex", fontSize: 36, color: "#a1a1aa", marginTop: 16, maxWidth: 900, lineHeight: 1.4 }}>
                    goSFU caps you at 2 waitlists. Watch as many sections as you want.
                </div>
                <div style={{ display: "flex", fontSize: 24, color: "#52525b", marginTop: 48 }}>
                    Not affiliated with or endorsed by Simon Fraser University.
                </div>
            </div>
        ),
        size
    );
}
