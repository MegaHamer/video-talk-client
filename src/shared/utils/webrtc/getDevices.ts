async function getDevices() {
  try {
    // Запрашиваем разрешение на доступ к камере/микрофону
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
} catch (error) {
    
    // Получаем список всех устройств
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    const cameras = devices.filter(device => device.kind === 'videoinput');
    const microphones = devices.filter(device => device.kind === 'audioinput');
    const speakers = devices.filter(device => device.kind === 'audiooutput');
    
    return { cameras, microphones, speakers };
  }
}

export default getDevices