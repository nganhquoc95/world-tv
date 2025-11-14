import { useEffect, useRef, useState } from 'react';
import { IChannelItem } from '../../types';
import './Player.css';

interface PlayerProps {
    channel: IChannelItem | null;
}

interface PlayerError {
    type: 'network' | 'auth' | 'format' | 'unknown';
    message: string;
    code?: number;
}

function Player({ channel }: PlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<any>(null);
    const [error, setError] = useState<PlayerError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [retryTrigger, setRetryTrigger] = useState(0);

    // Clear error state when channel changes
    useEffect(() => {
        if (channel) {
            setError(null);
            setIsLoading(true);
        }
    }, [channel]);

    useEffect(() => {
        if (!channel || !videoRef.current) return;

        setIsLoading(true);

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

                        // Add error handling for HLS.js
                        hlsRef.current.on((window as any).Hls.Events.ERROR, (_event: any, data: any) => {
                            console.error('HLS Error:', data);

                            if (data.fatal) {
                                switch (data.type) {
                                    case (window as any).Hls.ErrorTypes.NETWORK_ERROR:
                                        if (data.details === (window as any).Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
                                            data.details === (window as any).Hls.ErrorDetails.LEVEL_LOAD_ERROR) {
                                            // Check for 403 error
                                            if (data.response?.code === 403) {
                                                setError({
                                                    type: 'auth',
                                                    message: 'Access denied. This channel requires authentication or is geo-restricted.',
                                                    code: 403
                                                });
                                            } else {
                                                setError({
                                                    type: 'network',
                                                    message: 'Network error while loading stream. Please check your connection.',
                                                    code: data.response?.code
                                                });
                                            }
                                        } else {
                                            setError({
                                                type: 'network',
                                                message: 'Network error occurred while streaming.',
                                                code: data.response?.code
                                            });
                                        }
                                        break;
                                    case (window as any).Hls.ErrorTypes.MEDIA_ERROR:
                                        setError({
                                            type: 'format',
                                            message: 'Media format error. The stream may be corrupted.'
                                        });
                                        break;
                                    default:
                                        setError({
                                            type: 'unknown',
                                            message: 'An unknown error occurred while loading the stream.'
                                        });
                                        break;
                                }
                                setIsLoading(false);
                            }
                        });

                        hlsRef.current.loadSource(url);
                        hlsRef.current.attachMedia(videoElement);
                        hlsRef.current.on((window as any).Hls.Events.MANIFEST_PARSED, () => {
                            setIsLoading(false);
                            videoElement.play().catch(err => {
                                console.error('Playback error:', err);
                                setError({
                                    type: 'unknown',
                                    message: 'Failed to start playback. Please try again.'
                                });
                                setIsLoading(false);
                            });
                        });
                    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                        // Native HLS support (Safari)
                        videoElement.src = url;
                        videoElement.addEventListener('error', handleVideoError);
                        videoElement.addEventListener('loadstart', () => setIsLoading(true));
                        videoElement.addEventListener('canplay', () => setIsLoading(false));
                        videoElement.play().catch(err => {
                            console.error('Playback error:', err);
                            setError({
                                type: 'unknown',
                                message: 'Failed to start playback. Please try again.'
                            });
                            setIsLoading(false);
                        });
                    }
                } catch (error) {
                    console.error('Error loading HLS stream:', error);
                    setError({
                        type: 'unknown',
                        message: 'Failed to initialize video player.'
                    });
                    setIsLoading(false);
                }
            } else {
                // Direct stream (MPEG-TS, HTTP, etc.)
                videoElement.src = url;
                videoElement.addEventListener('error', handleVideoError);
                videoElement.addEventListener('loadstart', () => setIsLoading(true));
                videoElement.addEventListener('canplay', () => setIsLoading(false));
                videoElement.play().catch(err => {
                    console.error('Playback error:', err);
                    setError({
                        type: 'unknown',
                        message: 'Failed to start playback. Please try again.'
                    });
                    setIsLoading(false);
                });
            }
        };

        const handleVideoError = (e: Event) => {
            const video = e.target as HTMLVideoElement;
            const errorCode = video.error?.code;
            const httpStatus = (video as any).error?.status || (video as any).networkState === 2 ? 403 : undefined;

            console.error('Video element error:', video.error);

            if (httpStatus === 403 || errorCode === 4) { // MEDIA_ERR_SRC_NOT_SUPPORTED or 403
                setError({
                    type: 'auth',
                    message: 'Access denied. This channel requires authentication or is geo-restricted.',
                    code: 403
                });
            } else {
                setError({
                    type: 'network',
                    message: 'Failed to load video stream. Please check the URL or try again later.',
                    code: errorCode
                });
            }
            setIsLoading(false);
        };

        playChannel();

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.removeEventListener('error', handleVideoError);
            }
        };
    }, [channel, retryTrigger]);

    const copyStreamUrl = () => {
        if (!channel) return;
        navigator.clipboard.writeText(channel.url).then(() => {
            alert('Stream URL copied to clipboard!');
        }).catch(err => console.error('Copy error:', err));
    };

    const retryPlayback = () => {
        if (!channel) return;
        setError(null);
        setIsLoading(true);
        setRetryTrigger(prev => prev + 1);
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

    if (error) {
        return (
            <div className="player-container">
                <div className="player-error">
                    <div className="error-icon">
                        {error.type === 'auth' ? '🔒' : error.type === 'network' ? '🌐' : '⚠️'}
                    </div>
                    <h3 className="error-title">
                        {error.type === 'auth' ? 'Access Denied' : 'Playback Error'}
                    </h3>
                    <p className="error-message">{error.message}</p>
                    {error.code && (
                        <p className="error-code">Error Code: {error.code}</p>
                    )}
                    <div className="error-actions">
                        <button className="btn btn-primary" onClick={retryPlayback}>
                            🔄 Retry
                        </button>
                        <button className="btn btn-secondary" onClick={copyStreamUrl}>
                            📋 Copy URL
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="player-container">
            <div className="player-video">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner">⏳</div>
                        <p>Loading stream...</p>
                    </div>
                )}
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
