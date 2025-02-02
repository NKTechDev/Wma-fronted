import React, { useState, useEffect, useRef } from 'react';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices, MediaStream, mediaDevices } from 'react-native-webrtc';

import { useLiveMeetStore } from '../services/meetStore';
import { useUserStore } from '../services/userStore';
import { peerConstraints } from '../utils/Helpers';
import useSocket from './useSockethook';




export const useWebRTC = () => {
    const { participants, setStreamURL, sessionId, addSessionId, addParticipant, micOn, videoon,
        removeParticipant, updateParticipant, toggle
    } = useLiveMeetStore()
    const { user } = useUserStore()
    const [localStream, setLocalStream] = useState(null)
    const { emit, on, off } = useSocket()
    const peerConnections = useRef(new Map())
    const pendingCandidates = useRef(new Map())

    const startLocalStream = () => {
        try {
            const mediaDevices = mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });

            setLocalStream(mediaDevices);


        } catch (error) {

            console.error('Failed to start local stream : ', error);

        }
    }

    const establishPeerConnection = () => {
        participants?.forEach(async streamUser => {
            if (!peerConnections.current.has(streamUser?.userId)) {
                const peer = new RTCPeerConnection(peerConstraints);
                peerConnections.current.set(streamUser?.userId, peer);
                peer.ontrack = (event) => {
                    const remoteStream = new MediaStream();
                    event.stream[0].getTracks().forEach(track => {
                        remoteStream.addTrack(track);
                    })
                    console.log('recieving remote stream', remoteStream.toURL());
                    setStreamURL(streamUser?.userId, remoteStream)
                    remoteStream.addTrack(event.track);
                    setStreamURL(remoteStream);
                };

                peer.onicecandidate = (event) => {
                    if (candidate) {
                        emit('send-ice-candidate', {
                            sessionId,
                            sender: user?.id,
                            reciever: streamUser?.userId,
                            candidate,
                        });
                    }
                };
                localStream?.getTracks().forEach(track => {
                    peerConnection.addtrack(track, localStream)
                });


                try {
                    const offerDescription = await peerConnection.createoffer();
                    await peerConnection.setLocalDescription(offerDescription)
                    emit('send-offer', {
                        sessionId,
                        sender: user?.id,
                        receiver: streamUser?.userId,
                        offer: offerDescription,
                    })

                } catch (error) {

                    console.error('Failed to establish peer connection : ', error);

                }
            }
        })

    }


    const joinStream = async () => {
        await establishPeerConnection()
    };


    useEffect(() => {
        if (loacalStream) {
            joinStream()
        }
    }, [localStream])



    useEffect(() => {
        startLocalStream()
        if (localStream) {
            return () => {
                localStream.getTracks().forEach(track => {
                    track.stop()
                })
                localStream = null
            }
        }
    }, [])


    useEffect(() => {

        if (localStream) {
            on('receive-ice-candidate', handlerecieveicecandidate);
            on('receive-offer', handlereeroffer);
            on('recieve-answer', handleleavesession);
            on('new-participant', handleNewParticipant);
            on('participant-left', handleleavesession);
            on('participant-update', handleleavesession);


            return () => {
                localStream.getTracks().forEach(track => {
                    track.stop()
                })
                peerConnections.current.forEach(pc => pc.close())
                peerConnections.current.clear()
                addSessionId(null)
                clear()
                emit('hang-up');
                off('receive-ice-candidate', handlerecieveicecandidate);
                off('receive-offer', handleReceiveOffer);
                off('recieve-answer', handleleavesession);
                off('new-participant', handleleavesession);
                off('participant-left', handleleavesession);
                off('participant-update', handleleavesession);
            }



        }
    }, [localStream])


    const handleNewParticipant = (participant) => {

        if (participant?.userId === user?.id) return;
        addParticipant(participant)

    }

    const handleReceiveOffer = async ({ sender, receiver, offer }) => {
        if (receiver !== user?.id) {
            return;
        }
        try {
            let peerConnection = peerConnections.current.get(sender);
            if (!peerConnection) {
                peerConnection = new RTCPeerConnection(peerConstraints);
                peerConnections.current.set(sender, peerConnection);

                peerConnection.ontrack = (event) => {
                    const remoteStream = new MediaStream();
                    event.stream[0].getTracks().forEach(track => {
                        remoteStream.addTrack(track);
                    })
                    setStreamURL(sender, remoteStream)

                    peerConnection.onicecandidate = ({ candidate }) => {

                        if (candidate) {
                            emit('send-ice-candidate', {
                                sessionId,
                                sender:receiver,
                                reciever: sender,
                                candidate,
                            });

                        }


                    }

                };
                if (pendingCandidates.current.has(sender)) {
                    pendingCandidates.current.get(sender).forEach(candidate => {
                        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    })
                    pendingCandidates.current.delete(sender);
                }
                if (localStream){
                    localStream.getTracks().forEach(track =>{
                        peerConnection.addTrack(track, localStream)
                    })
                }
            }

            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answerDescription = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answerDescription);
            emit('send-answer', {
                sessionId,
                sender: receiver,
                receiver: sender,
                answer: answerDescription,
            });

        } catch (error) {

        }

    }












    return {
        localStream,
        participants,
        toggleMic,
        toggleVideo,
        startLocalStream,

    }
}