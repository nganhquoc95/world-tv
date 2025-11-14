"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("../styles/Player.css");
function Player({ channel }) {
    const videoRef = (0, react_1.useRef)(null);
    const hlsRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!channel || !videoRef.current)
            return;
        const playChannel = async () => {
            const url = channel.url;
            const videoElement = videoRef.current;
            // Stop current playback
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            // Check if URL is HLS (m3u8)
            if (url.includes('.m3u8')) {
                try {
                    // Dynamically import HLS.js
                    const HLS = window.Hls;
                    if (HLS && HLS.isSupported()) {
                        const hlsConfig = {
                            debug: false,
                            enableWorker: true,
                            lowLatencyMode: true,
                        };
                        // Add custom headers if available
                        if (channel.httpReferrer || channel.httpUserAgent) {
                            hlsConfig.fetchSetup = (context, initParams) => {
                                const headers = {};
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
                        hlsRef.current.on(window.Hls.Events.MANIFEST_PARSED, () => {
                            videoElement.play().catch(err => console.error('Playback error:', err));
                        });
                    }
                    else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                        // Native HLS support (Safari)
                        videoElement.src = url;
                        videoElement.play().catch(err => console.error('Playback error:', err));
                    }
                }
                catch (error) {
                    console.error('Error loading HLS stream:', error);
                }
            }
            else {
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
        if (!channel)
            return;
        navigator.clipboard.writeText(channel.url).then(() => {
            alert('Stream URL copied to clipboard!');
        }).catch(err => console.error('Copy error:', err));
    };
    if (!channel) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "player-container", children: (0, jsx_runtime_1.jsx)("div", { className: "player-placeholder", children: (0, jsx_runtime_1.jsx)("div", { className: "empty", children: "Please select a channel to play" }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "player-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "player-video", children: (0, jsx_runtime_1.jsx)("video", { ref: videoRef, controls: true, autoPlay: true, style: { width: '100%', height: '100%' } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "player-info", children: [(0, jsx_runtime_1.jsxs)("div", { className: "player-header", children: [channel.tvgLogo && ((0, jsx_runtime_1.jsx)("img", { src: channel.tvgLogo, alt: channel.name, className: "player-logo" })), (0, jsx_runtime_1.jsxs)("div", { className: "player-title-section", children: [(0, jsx_runtime_1.jsx)("h2", { className: "player-title", children: channel.name }), channel.groupTitle && ((0, jsx_runtime_1.jsx)("p", { className: "player-group", children: channel.groupTitle }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "player-metadata", children: [channel.countryCode && ((0, jsx_runtime_1.jsxs)("div", { className: "metadata-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Country:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: channel.countryCode.toUpperCase() })] })), channel.quanlity && ((0, jsx_runtime_1.jsxs)("div", { className: "metadata-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Quality:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: channel.quanlity })] })), channel.categories && channel.categories.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "metadata-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "label", children: "Categories:" }), (0, jsx_runtime_1.jsx)("span", { className: "value", children: channel.categories.join(', ') })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "player-actions", children: (0, jsx_runtime_1.jsx)("button", { className: "btn btn-primary", onClick: copyStreamUrl, children: "\uD83D\uDCCB Copy Stream URL" }) })] })] }));
}
exports.default = Player;
//# sourceMappingURL=Player.js.map