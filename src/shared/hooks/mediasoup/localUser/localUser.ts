import { Producer } from "mediasoup-client/types";

type ProducerType = "mic" | "camera" | "screen" | "screen audio";

class LocalUser {
  name: string = "";
  producers: Map<ProducerType, Producer | null> = new Map();
  private _isMuted: boolean = false;
  private _isMicrophoneWork: boolean = false;
  private isScreenSharing: boolean = false;

  get isScreenShare() {
    return this.isScreenSharing;
  }
  get isMuted() {
    return this._isMuted;
  }
  get isMicrophoneWork() {
    return this._isMicrophoneWork;
  }

  constructor(name: string = "") {
    this.name = name;
    // Инициализация
    this.producers.set("mic", null);
    this.producers.set("camera", null);
    this.producers.set("screen", null);
    this.producers.set("screen audio", null);
  }

  async addProducer(type: ProducerType, producer: Producer) {
    console.log("пришло", producer);
    this.producers.set(type, producer);
    if (type === "screen") this.isScreenSharing = true;
    if (type === "mic") this._isMicrophoneWork = true;
  }
  removeProducer(type: ProducerType) {
    const producer = this.producers.get(type);
    producer?.close();
    this.producers.set(type, null);
    if (type === "screen") {
      this.isScreenSharing = false;
      const screenAudio = this.producers.get("screen audio");
      screenAudio?.close();
      this.producers.set("screen audio", null);
    }
    if (type === "mic") this._isMicrophoneWork = false;
  }
  toggleMute() {
    const micProducer = this.producers.get("mic");
    if (!micProducer) return;

    this._isMuted = !this._isMuted;
    if (this._isMuted) micProducer.pause();
    else micProducer.resume();
  }

  // Получить текущие producers
  getProducers() {
    return Array.from(this.producers.entries()).filter(
      ([_, producer]) => producer !== null,
    );
  }
  getProducer(type: ProducerType){
    const producer = this.producers.get(type);
    return producer
  }
}

export default LocalUser;
