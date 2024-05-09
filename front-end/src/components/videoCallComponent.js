import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const VideoCall = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const peerRef = useRef(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideoRef.current.srcObject = stream;
                socketRef.current = io.connect('/');

                socketRef.current.on('other-user-offer', (userId, offer) => {
                    handleReceiveOffer(userId, offer, stream);
                });

                socketRef.current.on('other-user-answer', (userId, answer) => {
                    handleReceiveAnswer(userId, answer);
                });

                socketRef.current.on('other-user-ice-candidate', (userId, iceCandidate) => {
                    handleReceiveIceCandidate(userId, iceCandidate);
                });

                socketRef.current.emit('join-room', ROOM_ID);
            })
            .catch(error => console.error('Error accessing media devices: ', error));

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleReceiveOffer = (userId, offer, stream) => {
        peerRef.current = createPeer(userId, stream);
        peerRef.current.setRemoteDescription(offer)
            .then(() => peerRef.current.createAnswer())
            .then(answer => peerRef.current.setLocalDescription(answer))
            .then(() => {
                socketRef.current.emit('answer', userId, peerRef.current.localDescription);
            });
    };

    const handleReceiveAnswer = (userId, answer) => {
        peerRef.current.setRemoteDescription(answer);
    };

    const handleReceiveIceCandidate = (userId, iceCandidate) => {
        peerRef.current.addIceCandidate(iceCandidate);
    };

    const createPeer = (userId, stream) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.stunprotocol.org' },
                { urls: 'stun:stun.l.google.com:19302' },
            ],
        });

        peer.ontrack = event => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = event => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', userId, event.candidate);
            }
        };

        return peer;
    };

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted></video>
            <video ref={remoteVideoRef} autoPlay></video>
        </div>
    );
};

export default VideoCall;
