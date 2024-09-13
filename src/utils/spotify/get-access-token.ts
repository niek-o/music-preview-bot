import type { ApiToken } from "./types.js";

export async function getAccessToken(): Promise<ApiToken> {
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: new URLSearchParams({
            grant_type: "client_credentials"
        }),
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`
        }
    });

    if (!res.ok) {
        console.log(await res.json());

        throw Error("Something went wrong with fetching the Spotify Access Token");
    }

    return await res.json() as ApiToken;
}
