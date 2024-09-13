declare module "bun" {
    interface Env {
        readonly TOKEN: string
        readonly SPOTIFY_CLIENT_ID: string
        readonly SPOTIFY_CLIENT_SECRET: string
    }
}