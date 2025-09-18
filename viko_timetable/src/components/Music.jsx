import { useRef, useState } from "react";

export default function Music() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.volume = 0.1;
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/emotional.mp3" // place your music file in public/music folder
        autoPlay
        loop
      />

      <button
        className="p-1 bg-gray-300  text-sm absolute rounded-full top-[-10]"
        onClick={toggleMusic}
      >
        {isPlaying ? "🔇 Stop Music" : "🎵 Play Music"}
      </button>
    </div>
  );
}
