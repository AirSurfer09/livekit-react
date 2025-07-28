"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const livekit_rtc_1 = require("../../proto/livekit_rtc");
const events_1 = require("../events");
const TrackPublication_1 = __importDefault(require("./TrackPublication"));
class RemoteTrackPublication extends TrackPublication_1.default {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.currentVideoQuality = livekit_rtc_1.VideoQuality.HIGH;
    }
    /**
     * Subscribe or unsubscribe to this remote track
     * @param subscribed true to subscribe to a track, false to unsubscribe
     */
    setSubscribed(subscribed) {
        this.subscribed = subscribed;
        const sub = {
            trackSids: [this.trackSid],
            subscribe: this.subscribed,
        };
        this.emit(events_1.TrackEvent.UpdateSubscription, sub);
    }
    get isSubscribed() {
        if (this.subscribed === false) {
            return false;
        }
        return super.isSubscribed;
    }
    get isEnabled() {
        return !this.disabled;
    }
    /**
     * disable server from sending down data for this track. this is useful when
     * the participant is off screen, you may disable streaming down their video
     * to reduce bandwidth requirements
     * @param enabled
     */
    setEnabled(enabled) {
        if (this.disabled === !enabled) {
            return;
        }
        this.disabled = !enabled;
        this.emitTrackUpdate();
    }
    /**
     * for tracks that support simulcasting, adjust subscribed quality
     *
     * This indicates the highest quality the client can accept. if network
     * bandwidth does not allow, server will automatically reduce quality to
     * optimize for uninterrupted video
     */
    setVideoQuality(quality) {
        if (this.currentVideoQuality === quality) {
            return;
        }
        this.currentVideoQuality = quality;
        this.emitTrackUpdate();
    }
    get videoQuality() {
        return this.currentVideoQuality;
    }
    /** @internal */
    updateInfo(info) {
        var _a;
        super.updateInfo(info);
        this.metadataMuted = info.muted;
        (_a = this.track) === null || _a === void 0 ? void 0 : _a.setMuted(info.muted);
    }
    emitTrackUpdate() {
        const settings = {
            trackSids: [this.trackSid],
            disabled: this.disabled,
            quality: this.currentVideoQuality,
        };
        this.emit(events_1.TrackEvent.UpdateSettings, settings);
    }
}
exports.default = RemoteTrackPublication;
//# sourceMappingURL=RemoteTrackPublication.js.map