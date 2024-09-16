import { unlink } from "node:fs/promises";

export async function createVideo(id: string): Promise<void> {
    // eslint-disable-next-line @stylistic/max-len
    const proc = Bun.spawn(["ffmpeg", "-loop", "1", "-i", `temp/${id}.png`, "-i", `temp/${id}.mp3`, "-shortest", "-c:v", "libx264", "-tune", "stillimage", "-c:a", "aac", "-b:a", "192k", "-pix_fmt", "yuv420p", `temp/${id}.mp4`]);

    console.log(await proc.exited);

    return;
}

export async function deleteFiles(id: string): Promise<void> {
    await Promise.all([
        unlink(`temp/${id}.png`),
        unlink(`temp/${id}.mp3`),
        unlink(`temp/${id}.mp4`)
    ]);
    return;
}
