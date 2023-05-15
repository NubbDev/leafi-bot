
import { EventType } from "../types";
import {SpotifyExtractor, SoundCloudExtractor, YouTubeExtractor} from '@discord-player/extractor'

export default {
    name: "Music Player Init",
    async run(client) {
        await client.player.extractors.register(YouTubeExtractor, {})
        await client.player.extractors.register(SpotifyExtractor, {})
        await client.player.extractors.register(SoundCloudExtractor, {})
    },
} as EventType