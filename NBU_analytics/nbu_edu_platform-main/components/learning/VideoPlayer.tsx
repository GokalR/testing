"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  title: string;
  durationSec: number;
  initialPosition?: number;
  onProgress?: (watchedSec: number, lastPosition: number) => void;
  onComplete?: () => void;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

function formatTime(seconds: number): string {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// SVG Icons
function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <rect x="5" y="3" width="4" height="18" rx="1" />
      <rect x="15" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function IconVolumeOn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3 9v6h4l5 5V4L7 9H3z" />
      <path
        d="M16.5 12A4.5 4.5 0 0 0 14 7.97v8.06A4.48 4.48 0 0 0 16.5 12z"
        opacity="0.8"
      />
      <path
        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
        opacity="0.6"
      />
    </svg>
  );
}

function IconVolumeMute() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.42l2.45 2.45c.03-.28.05-.56.05-.84z" />
      <path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
      <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18L19 19.27 20.27 18 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function IconFullscreen() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  );
}

function IconCompress() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
    </svg>
  );
}

export function VideoPlayer({
  src,
  title,
  durationSec,
  initialPosition = 0,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchedSecondsRef = useRef<number>(0);
  const completionFiredRef = useRef<boolean>(false);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialPosition);
  const [duration, setDuration] = useState(durationSec);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState<Speed>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);

  // Auto-resume on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (initialPosition > 0) {
      video.currentTime = initialPosition;
    }
  }, [initialPosition]);

  // Sync duration from metadata
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && isFinite(video.duration)) {
      setDuration(video.duration);
    }
    if (initialPosition > 0) {
      video.currentTime = initialPosition;
    }
  }, [initialPosition]);

  // Time update — also grabs duration as fallback if loadedmetadata missed it
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration && isFinite(video.duration)) {
      setDuration((prev) => (prev > 0 ? prev : video.duration));
    }
  }, []);

  // Progress interval (every 5s while playing)
  const startProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) return;
    progressIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused) return;
      watchedSecondsRef.current += 5;
      onProgress?.(watchedSecondsRef.current, video.currentTime);
      // Completion check
      if (
        !completionFiredRef.current &&
        watchedSecondsRef.current >= durationSec * 0.9
      ) {
        completionFiredRef.current = true;
        onComplete?.();
      }
    }, 5000);
  }, [onProgress, onComplete, durationSec]);

  const stopProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    startProgressInterval();
  }, [startProgressInterval]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    stopProgressInterval();
  }, [stopProgressInterval]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    stopProgressInterval();
    if (!completionFiredRef.current) {
      completionFiredRef.current = true;
      onComplete?.();
    }
  }, [stopProgressInterval, onComplete]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsPlaying(false);
    stopProgressInterval();
  }, [stopProgressInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressInterval();
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [stopProgressInterval]);

  // Fullscreen change detection
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Controls auto-hide
  const resetHideTimer = useCallback(() => {
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    setControlsVisible(true);
    hideControlsTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, 3000);
  }, []);

  const handleMouseMove = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setControlsVisible(false);
    }
  }, [isPlaying]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // Volume change
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current;
      if (!video) return;
      const val = parseFloat(e.target.value);
      video.volume = val;
      setVolume(val);
      if (val === 0) {
        video.muted = true;
        setIsMuted(true);
      } else {
        video.muted = false;
        setIsMuted(false);
      }
    },
    []
  );

  // Speed change
  const handleSpeedChange = useCallback((s: Speed) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = s;
    setSpeed(s);
    setShowSpeedMenu(false);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      void container.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }, []);

  // Seek by clicking the seek bar div
  const handleSeekClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = seekBarRef.current;
      const video = videoRef.current;
      if (!bar || !video) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    },
    [duration]
  );

  // Seek drag
  const handleSeekPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const bar = seekBarRef.current;
      if (!bar) return;
      setIsDraggingSeek(true);
      bar.setPointerCapture(e.pointerId);
    },
    []
  );

  const handleSeekPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingSeek) return;
      const bar = seekBarRef.current;
      const video = videoRef.current;
      if (!bar || !video) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    },
    [isDraggingSeek, duration]
  );

  const handleSeekPointerUp = useCallback(() => {
    setIsDraggingSeek(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept if focus is on an input/button/select
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA"
      )
        return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(duration, video.currentTime + 5);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute, duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full bg-black overflow-hidden rounded-xl select-none group",
        "aspect-video"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        // Click on container (not controls) toggles play
        if ((e.target as HTMLElement).closest("[data-controls]")) return;
        togglePlay();
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        playsInline
      />

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-foreground gap-3">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-12 h-12 text-destructive"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className="text-sm text-muted-foreground">
            Could not load video: {title}
          </p>
        </div>
      )}

      {/* Center play/pause feedback */}
      <AnimatePresence>
        {!isPlaying && !hasError && (
          <motion.div
            key="play-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
              <IconPlay />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls bar */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            key="controls"
            data-controls
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8 bg-gradient-to-t from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Seek bar */}
            <div
              ref={seekBarRef}
              className="relative w-full h-1.5 mb-3 rounded-full bg-white/20 cursor-pointer group/seek"
              onClick={handleSeekClick}
              onPointerDown={handleSeekPointerDown}
              onPointerMove={handleSeekPointerMove}
              onPointerUp={handleSeekPointerUp}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            >
              {/* Filled portion */}
              <div
                className="h-full rounded-full bg-primary transition-none"
                style={{ width: `${progress}%` }}
              />
              {/* Thumb */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary",
                  "opacity-0 group-hover/seek:opacity-100 transition-opacity duration-150",
                  isDraggingSeek && "opacity-100"
                )}
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors duration-150 p-1 rounded"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <IconPause /> : <IconPlay />}
              </button>

              {/* Time */}
              <span className="font-mono text-xs text-white/80 tabular-nums min-w-[80px]">
                {formatTime(currentTime)}{" "}
                <span className="text-white/50">/</span>{" "}
                {formatTime(duration)}
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Volume */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-white hover:text-primary transition-colors duration-150 p-1 rounded"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || effectiveVolume === 0 ? (
                    <IconVolumeMute />
                  ) : (
                    <IconVolumeOn />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className={cn(
                    "w-0 opacity-0 group-hover/vol:w-16 group-hover/vol:opacity-100",
                    "transition-all duration-200 cursor-pointer accent-primary h-1"
                  )}
                  aria-label="Volume"
                />
              </div>

              {/* Speed selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSpeedMenu((v) => !v)}
                  className="font-mono text-xs text-white/80 hover:text-primary transition-colors duration-150 px-1.5 py-0.5 rounded border border-white/20 hover:border-primary/60"
                  aria-label="Playback speed"
                >
                  {speed}x
                </button>
                <AnimatePresence>
                  {showSpeedMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{
                        duration: 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="absolute bottom-full mb-2 right-0 flex flex-col gap-1 bg-black/90 backdrop-blur-sm border border-border rounded-lg p-1.5 min-w-[64px]"
                    >
                      {SPEEDS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSpeedChange(s)}
                          className={cn(
                            "font-mono text-xs px-2.5 py-1 rounded-md transition-colors duration-100 text-center",
                            speed === s
                              ? "bg-primary text-primary-foreground"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {s}x
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="text-white hover:text-primary transition-colors duration-150 p-1 rounded"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <IconCompress /> : <IconFullscreen />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
