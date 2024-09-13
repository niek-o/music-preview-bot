import type { ApiToken, Search, Track } from "./types.js";

export class SpotifyClient {
    readonly #clientId: string;
    readonly #clientSecret: string;

    #token: ApiToken | undefined = undefined;

    public constructor(clientId: string, clientSecret: string) {
        this.#clientId = clientId;
        this.#clientSecret = clientSecret;
    }

    async #getAccessToken(): Promise<ApiToken> {
        const res = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: new URLSearchParams({
                grant_type: "client_credentials"
            }),
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${this.#clientId}:${this.#clientSecret}`).toString("base64")}`
            }
        });

        if (!res.ok) {
            console.log(await res.json());

            throw Error("Something went wrong with fetching the Spotify Access Token");
        }

        const json = await res.json() as ApiToken;

        return json;
    }

    public async search(query: string): Promise<Search | null> {
        if (typeof this.#token === "undefined") {
            try {
                this.#token = await this.#getAccessToken();

                setTimeout(() => (this.#token = undefined), this.#token.expires_in * 1000);
            } catch (err) {
                console.error(new Error("Failed to get new token", { cause: err }));
                return null;
            }

            if (typeof this.#token === "undefined")
                return null;
        }

        const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {
            headers: {
                Authorization: `Bearer ${this.#token.access_token}`
            }
        });

        if (!res.ok) {
            console.error(await res.json());
            return null;
        }

        const json = await res.json() as Search;

        return json;
    }

    public async getTrackById(id: string): Promise<Track | null> {
        if (typeof this.#token === "undefined") {
            try {
                const token = await this.#getAccessToken();

                setTimeout(() => (this.#token = undefined), token.expires_in * 1000);
            } catch (err) {
                console.error(new Error("Failed to get new token", { cause: err }));
                return null;
            }

            if (typeof this.#token === "undefined")
                return null;
        }

        const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: {
                Authorization: `Bearer ${this.#token.access_token}`
            }
        });

        if (!res.ok) {
            console.error(await res.json());
            return null;
        }

        const json = await res.json() as Track;

        return json;
    }
}
