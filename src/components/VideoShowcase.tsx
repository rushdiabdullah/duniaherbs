'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Video = {
  id: string;
  title: string;
  label: string;
  video_url: string;
};

const fallbackVideos: Video[] = [
  { id: '1', title: 'Iklan 1', label: 'Iklan Dunia Herbs', video_url: '/IMG_0587.MP4' },
  { id: '2', title: 'Iklan 2', label: 'Iklan Dunia Herbs', video_url: '/IMG_0596.MP4' },
  { id: '3', title: 'Iklan 3', label: 'Iklan Dunia Herbs', video_url: '/IMG_0605.MP4' },
  { id: '4', title: 'Iklan 4', label: 'Iklan Dunia Herbs', video_url: '/IMG_0611.MP4' },
  { id: '5', title: 'Iklan 5', label: 'Iklan Dunia Herbs', video_url: '/IMG_0587.MP4' },
  { id: '6', title: 'Iklan 6', label: 'Iklan Dunia Herbs', video_url: '/IMG_0596.MP4' },
];

function VideoCard({ video, index }: { video: Video; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <motion.div
      ref={containerRef}
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div
        className="relative aspect-video rounded-xl overflow-hidden border border-stone-700/50 bg-stone-950 cursor-pointer"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={video.video_url}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          playsInline
          loop
          muted
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
              <svg className="h-6 w-6 text-stone-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm transition hover:bg-black/80 hover:text-white opacity-0 group-hover:opacity-100"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
      <div className="mt-2 px-1">
        <p className="text-stone-200 text-sm font-medium truncate">{video.title}</p>
        <p className="text-stone-500 text-xs">{video.label}</p>
      </div>
    </motion.div>
  );
}

export function VideoShowcase() {
  const [videos, setVideos] = useState<Video[]>(fallbackVideos);

  useEffect(() => {
    async function load() {
      try {
        const supabase = getSupabaseBrowser();
        const { data } = await supabase
          .from('videos')
          .select('id, title, label, video_url')
          .eq('visible', true)
          .eq('type', 'iklan')
          .order('sort_order');
        if (data && data.length > 0) setVideos(data);
      } catch {
        // fallback
      }
    }
    load();
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {videos.map((v, i) => (
        <VideoCard key={v.id} video={v} index={i} />
      ))}
    </div>
  );
}
