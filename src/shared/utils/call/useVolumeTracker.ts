import { useEffect, useRef, useState } from "react";

export const useVolumeTracker = (track: MediaStreamTrack | null) => {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!track) return;

    // 1. Создаем клон трека для анализа (чтобы не мешать основному потоку)
    const audioStream = new MediaStream([track.clone()]); // Ключевое изменение!

    // 2. Инициализируем AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.AudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; // Оптимально для VAD
    }

    // 3. Подключаем клон трека к анализатору
    if (sourceRef.current) sourceRef.current.disconnect();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(audioStream);
    sourceRef.current.connect(analyserRef.current);

    // 4. Медленный опрос (10 раз/сек) для минимизации нагрузки
    const updateVolume = () => {
      const data = new Uint8Array(analyserRef.current!.frequencyBinCount);
      analyserRef.current!.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setVolume(avg);
      // animationFrameRef.current = setTimeout(updateVolume, 100); // Не requestAnimationFrame!
    };

    updateVolume();

    return () => {
      clearTimeout(animationFrameRef.current);
      sourceRef.current?.disconnect();
      audioStream.getTracks().forEach(t => t.stop()); // Важно: останавливаем клон
    };
  }, [track]);

  return volume;
};