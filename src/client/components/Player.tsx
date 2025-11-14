import { useEffect, useRef } from 'react';
import { IChannelItem } from '../types';
import '../styles/Player.css';

interface PlayerProps {
    channel: IChannelItem | null;
}

function Player({ channel }: PlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<any>(null);

    useEffect(() => {
        if (!channel || !videoRef.current) return;

        const playChannel = async () => {
            const url = channel.url;
            const videoElement = videoRef.current!;

            // Stop current playback
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            // Check if URL is HLS (m3u8)
            if (url.includes('.m3u8')) {
                try {
                    // Dynamically import HLS.js
                    const HLS = (window as any).Hls;
                    if (HLS && HLS.isSupported()) {
                        const hlsConfig = {
                            debug: false,
                            enableWorker: true,
                            lowLatencyMode: true,
                        };

                        // Add custom headers if available
                        if (channel.httpReferrer || channel.httpUserAgent) {
                            (hlsConfig as any).fetchSetup = (context: any, initParams: any) => {
                                const headers: Record<string, string> = {};
                                if (channel.httpReferrer) {
                                    headers['Referer'] = channel.httpReferrer;
                                }
                                if (channel.httpUserAgent) {
                                    headers['User-Agent'] = channel.httpUserAgent;
                                }
                                initParams.headers = Object.assign({}, initParams.headers, headers);
                                return new Request(context.url, initParams);
                            };
                        }

                        hlsRef.current = new HLS(hlsConfig);
                        hlsRef.current.loadSource(url);
                        hlsRef.current.attachMedia(videoElement);
                        hlsRef.current.on((window as any).Hls.Events.MANIFEST_PARSED, () => {
                            videoElement.play().catch(err => console.error('Playback error:', err));
                        });
                    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                        // Native HLS support (Safari)
                        videoElement.src = url;
                        videoElement.play().catch(err => console.error('Playback error:', err));
                    }
                } catch (error) {
                    console.error('Error loading HLS stream:', error);
                }
            } else {
                // Direct stream (MPEG-TS, HTTP, etc.)
                videoElement.src = url;
                videoElement.play().catch(err => console.error('Playback error:', err));
            }
        };

        playChannel();

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [channel]);

    const copyStreamUrl = () => {
        if (!channel) return;
        navigator.clipboard.writeText(channel.url).then(() => {
            alert('Stream URL copied to clipboard!');
        }).catch(err => console.error('Copy error:', err));
    };

    if (!channel) {
        return (
            <div className="player-container">
                <div className="player-placeholder">
                    <div className="empty">Please select a channel to play</div>
                </div>
            </div>
        );
    }

    return (
        <div className="player-container">
            <div className="player-video">
                <video
                    ref={videoRef}
                    controls
                    autoPlay
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            <div className="player-info">
                <div className="player-header">
                    {channel.tvgLogo && (
                        <img src={channel.tvgLogo} alt={channel.name} className="player-logo" />
                    )}
                    <div className="player-title-section">
                        <h2 className="player-title">{channel.name}</h2>
                        {channel.groupTitle && (
                            <p className="player-group">{channel.groupTitle}</p>
                        )}
                    </div>
                </div>

                <div className="player-metadata">
                    {channel.countryCode && (
                        <div className="metadata-item">
                            <span className="label">Country:</span>
                            <span className="value">{channel.countryCode.toUpperCase()}</span>
                        </div>
                    )}
                    {channel.quanlity && (
                        <div className="metadata-item">
                            <span className="label">Quality:</span>
                            <span className="value">{channel.quanlity}</span>
                        </div>
                    )}
                    {channel.categories && channel.categories.length > 0 && (
                        <div className="metadata-item">
                            <span className="label">Categories:</span>
                            <span className="value">{channel.categories.join(', ')}</span>
                        </div>
                    )}
                </div>

                <div className="player-actions">
                    <button className="btn btn-primary" onClick={copyStreamUrl}>
                        📋 Copy Stream URL
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Player;
