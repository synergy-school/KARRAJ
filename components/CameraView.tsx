import React, { useState, useRef } from 'react';
import { CameraIcon, ZoomInIcon, ZoomOutIcon, ResetIcon } from './Icons';

// NOTE: Replace this URL with the actual IP address and stream endpoint of your Arduino camera.
const ARDUINO_CAMERA_URL = 'http://192.168.1.100/stream';

const CameraView: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanPoint = useRef({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError("Failed to connect to the Arduino camera. Please check the device's power, network connection, and ensure the stream URL is correct.");
  };

  const resetTransform = () => {
    setTransform({ scale: 1, x: 0, y: 0 });
  };
  
  const handleZoom = (direction: 'in' | 'out', amount: number = 0.2) => {
    setTransform(prev => {
      const newScale = direction === 'in' ? prev.scale + amount : prev.scale - amount;
      const clampedScale = Math.max(1, Math.min(newScale, 8)); // Clamp zoom between 1x and 8x

      if (clampedScale === 1) {
        return { scale: 1, x: 0, y: 0 }; // Reset pan if zoomed all the way out
      }
      
      return { ...prev, scale: clampedScale };
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (error || isLoading) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoom('in', 0.1);
    } else {
      handleZoom('out', 0.1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (transform.scale > 1) {
      e.preventDefault();
      setIsPanning(true);
      startPanPoint.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      e.preventDefault();
      const container = imageContainerRef.current;
      if (!container) return;
      
      const x = e.clientX - startPanPoint.current.x;
      const y = e.clientY - startPanPoint.current.y;
      
      const maxPanX = (transform.scale - 1) * container.clientWidth / 2;
      const maxPanY = (transform.scale - 1) * container.clientHeight / 2;
      
      const clampedX = Math.max(-maxPanX, Math.min(x, maxPanX));
      const clampedY = Math.max(-maxPanY, Math.min(y, maxPanY));

      setTransform(prev => ({ ...prev, x: clampedX, y: clampedY }));
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  const getCursor = () => {
    if (transform.scale > 1) {
      return isPanning ? 'grabbing' : 'grab';
    }
    return 'default';
  };

  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex items-center text-slate-700 mb-4">
        <div className="w-8 h-8 mr-3"><CameraIcon /></div>
        <h2 className="text-2xl font-bold">Live Camera Feed (Arduino)</h2>
      </div>
      <div 
        ref={imageContainerRef}
        className="aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ cursor: getCursor() }}
        onDoubleClick={resetTransform}
      >
        {isLoading && <div className="text-white">Connecting to camera stream...</div>}
        {error && <div className="text-red-400 text-center p-4">{error}</div>}

        <img
          src={ARDUINO_CAMERA_URL}
          alt="Arduino Camera Feed"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-transform duration-100 ease-out ${isLoading || error ? 'hidden' : 'block'}`}
          style={{
            transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
          }}
          draggable="false"
        />
        
        {!isLoading && !error && (
          <>
            <div className="absolute top-3 left-3 bg-red-600/80 text-white text-xs font-bold uppercase px-2 py-1 rounded flex items-center pointer-events-none">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                LIVE
            </div>

            <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg p-1 flex items-center space-x-1">
              <button onClick={() => handleZoom('in')} className="p-2 text-white hover:bg-white/20 rounded-md transition-colors" title="Zoom In"><ZoomInIcon className="w-5 h-5" /></button>
              <button onClick={() => handleZoom('out')} className="p-2 text-white hover:bg-white/20 rounded-md transition-colors" title="Zoom Out"><ZoomOutIcon className="w-5 h-5" /></button>
              <button onClick={resetTransform} className="p-2 text-white hover:bg-white/20 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled={transform.scale === 1 && transform.x === 0 && transform.y === 0} title="Reset Zoom"><ResetIcon className="w-5 h-5" /></button>
            </div>
          </>
        )}
      </div>
      {!error && (
        <p className="text-xs text-slate-500 mt-2 text-center">
          Use mouse wheel to zoom, click and drag to pan, or double-click to reset.
        </p>
      )}
    </div>
  );
};

export default CameraView;
