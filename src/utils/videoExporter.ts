/**
 * Video & frame exporter using HTML Canvas stream & MediaRecorder.
 */
export async function exportCanvasVideo(
  canvas: HTMLCanvasElement,
  duration: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // 30 fps stream from the canvas
      const stream = canvas.captureStream(30);

      // Determine supported mime type
      const mimeTypes = [
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 8000000, // 8 Mbps high quality
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMime });
        resolve(blob);
      };

      recorder.onerror = (e) => {
        reject(e);
      };

      recorder.start(100);

      const startTime = performance.now();
      const interval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        const progress = Math.min(1, elapsed / duration);
        if (onProgress) onProgress(progress);

        if (elapsed >= duration) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 100);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Triggers browser download for a blob or canvas snapshot
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
