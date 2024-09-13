export interface ApiToken {
    access_token: string;
    token_type: "bearer";
    expires_in: number;
}

export interface Album {
    album_type: "album" | "single" | "compilation";
    total_tracks: number;
    available_markets: Array<string>;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Array<Image>;
    name: string;
    release_date: string;
    release_date_precision: "year" | "date" | "month";
    restrictions: Restrictions;
    type: "album";
    uri: string;
}

export interface Restrictions {
    reason: "market" | "product" | "explicit";
}

export interface Image {
    url: string;
    height: number | null;
    width: number | null;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Track {
    album: Album;
    artists: Array<SimplifiedArtist>;
    available_markets: Array<string>;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string,
        ean: string,
        upc: string
    };
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: object;
    restrictions: Restrictions;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: string;
    type: string;
    uri: string;
    is_local: boolean;
}

export type SimplifiedArtist = Omit<Artist, "followers" | "genres" | "images" | "popularity">;

export type Artist = {
    external_urls: ExternalUrls,
    followers: {
        href: string | null,
        total: number
    },
    genres: Array<string>,
    href: string,
    id: string,
    images: Array<Image>,
    name: string,
    popularity: number,
    type: "artist",
    uri: string
};

export interface Followers {
    href: string | null;
    total: number;
}

export interface Search {
    tracks: {
        items: Array<Track>
    };
}
