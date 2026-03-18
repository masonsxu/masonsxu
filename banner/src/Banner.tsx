import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// === Design Tokens ===
const BG = "#0D1117";
const TEXT = "#E6EDF3";
const ACCENT = "#D4AF37";
const MUTED = "#8B949E";
const TAG_BG = "#161B22";
const TAG_BORDER = "#30363D";

const baseFont: React.CSSProperties = {
  fontFamily,
  color: TEXT,
};

// === Background with subtle grid ===
const GridBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${TAG_BORDER} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

// === Scene 1: Name + Title ===
const NameScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const name = "Mason Xu";
  const title = "Go Architect  ·  CloudWeGo Contributor";

  const nameLen = interpolate(frame, [0, 0.6 * fps], [0, name.length], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const visibleName = name.slice(0, Math.floor(nameLen));

  const showCursor = frame < 1.8 * fps;
  const cursorOn = Math.sin(frame * 0.4) > 0;

  const titleProgress = spring({
    frame,
    fps,
    delay: Math.floor(0.8 * fps),
    config: { damping: 200 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [15, 0]);

  const bracketOpacity = interpolate(
    frame,
    [0.4 * fps, 0.8 * fps],
    [0, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <GridBackground>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div style={{ textAlign: "center", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: -15,
              left: -40,
              fontSize: 60,
              color: ACCENT,
              opacity: bracketOpacity,
              ...baseFont,
            }}
          >
            {"{"}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: -40,
              fontSize: 60,
              color: ACCENT,
              opacity: bracketOpacity,
              ...baseFont,
            }}
          >
            {"}"}
          </div>

          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: 2,
              ...baseFont,
            }}
          >
            {visibleName}
            {showCursor && (
              <span style={{ color: ACCENT, opacity: cursorOn ? 1 : 0 }}>
                _
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: 16,
              color: ACCENT,
              marginTop: 10,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              letterSpacing: 1,
              ...baseFont,
            }}
          >
            {title}
          </div>
        </div>
      </AbsoluteFill>
    </GridBackground>
  );
};

// === Scene 2: Tech Stack Tags ===
const TechStackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tags = [
    "Go",
    "CloudWeGo/Kitex",
    "Hertz",
    "gRPC",
    "PostgreSQL",
    "Redis",
    "Docker",
    "OpenTelemetry",
    "DDD",
    "Casbin RBAC",
  ];

  const headerProgress = spring({ frame, fps, config: { damping: 200 } });

  return (
    <GridBackground>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
        }}
      >
        <div style={{ textAlign: "center", width: "100%" }}>
          <div
            style={{
              fontSize: 14,
              color: MUTED,
              marginBottom: 18,
              opacity: headerProgress,
              ...baseFont,
            }}
          >
            {"// core_stack.go"}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {tags.map((tag, i) => {
              const delay = 5 + i * 3;
              const scale = spring({
                frame,
                fps,
                delay,
                config: { damping: 12, stiffness: 200 },
              });
              const opacity = interpolate(scale, [0, 0.3], [0, 1], {
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={tag}
                  style={{
                    transform: `scale(${scale})`,
                    opacity,
                    padding: "5px 14px",
                    borderRadius: 16,
                    border: `1px solid ${ACCENT}40`,
                    backgroundColor: TAG_BG,
                    fontSize: 13,
                    ...baseFont,
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </GridBackground>
  );
};

// === Main Banner Composition ===
export const Banner: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={80}>
          <NameScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={75}>
          <TechStackScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
