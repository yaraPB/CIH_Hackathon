'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Camera, Keyboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!manualMode) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [manualMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError(t('qr.error'));
      console.error('Camera error:', err);
      setManualMode(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{t('qr.title')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!manualMode ? (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '300px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none" style={{ margin: '20px' }} />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <p className="text-sm text-center text-gray-600">
                {t('qr.scanning')}
              </p>

              <button
                onClick={() => setManualMode(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Keyboard className="h-4 w-4 mr-2" />
                {t('qr.manualEntry')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('qr.enterCode')}
                </label>
                <input
                  type="text"
                  id="qrCode"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="050620251247094208472"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setManualMode(false)}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Use Camera
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualCode.trim()}
                  className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {t('qr.submit')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
