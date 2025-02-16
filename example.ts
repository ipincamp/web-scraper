import { TikTok } from "./src";

(async () => {
    /**
     * Video: https://www.tiktok.com/@bg.andii/video/7140173156311960858
     * Photo: https://www.tiktok.com/@areioutdoorgear_/photo/7471638638397328646
     */
    const tiktokURL = 'https://www.tiktok.com/@areioutdoorgear_/photo/7471638638397328646';
    const tiktok = new TikTok(tiktokURL)

    const snaptik = await tiktok.snaptik();
    console.info(snaptik);

    const ssstik = await tiktok.ssstik();
    console.info(ssstik);

    const musicallydown = await tiktok.musicallydown();
    console.info(musicallydown);
})();
