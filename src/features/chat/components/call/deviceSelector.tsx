import getDevices from '@/shared/utils/webrtc/getDevices';
import { useState, useEffect } from 'react';

export function DeviceSelector() {
  const [devices, setDevices] = useState({
    cameras: [],
    microphones: [],
    speakers: []
  });
  const [selectedDevices, setSelectedDevices] = useState({
    camera: '',
    microphone: '',
    speaker: ''
  });

  useEffect(() => {
    // Первоначальная загрузка устройств
    const loadDevices = async () => {
      const deviceList = await getDevices();
      setDevices(deviceList);
    };
    
    loadDevices();

    // Подписка на изменения устройств
    const handleDeviceChange = async () => {
      const updatedDevices = await getDevices();
      setDevices(updatedDevices);
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    // Отписка при размонтировании компонента
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []);

  const handleDeviceChange = (type, deviceId) => {
    setSelectedDevices(prev => ({
      ...prev,
      [type]: deviceId
    }));
  };

  return (
    <div className="text-white">
      <div className="device-group">
        <h3>Камера:</h3>
        <select className="*:text-black" 
          value={selectedDevices.camera}
          onChange={(e) => handleDeviceChange('camera', e.target.value)}
        >
          {devices.cameras.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Камера ${devices.cameras.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>
      
      <div className="device-group">
        <h3>Микрофон:</h3>
        <select className="*:text-black" 
          value={selectedDevices.microphone}
          onChange={(e) => handleDeviceChange('microphone', e.target.value)}
        >
          {devices.microphones.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Микрофон ${devices.microphones.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>
      
      <div className="device-group">
        <h3>Динамики:</h3>
        <select className="*:text-black" 
          value={selectedDevices.speaker}
          onChange={(e) => handleDeviceChange('speaker', e.target.value)}
        >
          {devices.speakers.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Динамики ${devices.speakers.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}