import { TrackInfo } from '../../proto/livekit_models';
import { VideoQuality } from '../../proto/livekit_rtc';
import TrackPublication from './TrackPublication';
import { RemoteTrack } from './types';
export default class RemoteTrackPublication extends TrackPublication {
    track?: RemoteTrack;
    protected subscribed?: boolean;
    protected disabled: boolean;
    protected currentVideoQuality: VideoQuality;
    /**
     * Subscribe or unsubscribe to this remote track
     * @param subscribed true to subscribe to a track, false to unsubscribe
     */
    setSubscribed(subscribed: boolean): void;
    get isSubscribed(): boolean;
    get isEnabled(): boolean;
    /**
     * disable server from sending down data for this track. this is useful when
     * the participant is off screen, you may disable streaming down their video
     * to reduce bandwidth requirements
     * @param enabled
     */
    setEnabled(enabled: boolean): void;
    /**
     * for tracks that support simulcasting, adjust subscribed quality
     *
     * This indicates the highest quality the client can accept. if network
     * bandwidth does not allow, server will automatically reduce quality to
     * optimize for uninterrupted video
     */
    setVideoQuality(quality: VideoQuality): void;
    get videoQuality(): VideoQuality;
    /** @internal */
    updateInfo(info: TrackInfo): void;
    protected emitTrackUpdate(): void;
}
