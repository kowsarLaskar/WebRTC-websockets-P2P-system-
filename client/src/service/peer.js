class PeerService {
  constructor() {
    if (typeof window !== 'undefined' && !this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });

 
      this.peer.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.setupDataChannelEvents();
      };
    }
  }


  createDataChannel = () => {
    this.dataChannel = this.peer.createDataChannel("chat");
    this.setupDataChannelEvents();
  };

  
  setupDataChannelEvents = () => {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log("Data channel opened ✅");
    };

    this.dataChannel.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };

    this.dataChannel.onerror = (err) => {
      console.error("Data channel error ❌:", err);
    };

    this.dataChannel.onclose = () => {
      console.log("Data channel closed ❌");
    };
  };


  sendMessage = (message) => {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      this.dataChannel.send(message);
    } else {
      console.warn("Data channel is not open ⚠️");
    }
  };


  onMessage = (callback) => {
    this.onMessageCallback = callback;
  };


  setLocalDescription = async (ans) => {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  };

 
  getAnswer = async (offer) => {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  };


  getOffer = async () => {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  };

 
  toggleAudio = () => {
    const audioTrack = this.peer
      .getSenders()
      .find((s) => s.track && s.track.kind === "audio")?.track;

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  toggleVideo = () => {
    const videoTrack = this.peer
      .getSenders()
      .find((s) => s.track && s.track.kind === "video")?.track;

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    }
  };
}

export default new PeerService();
