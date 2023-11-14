import { load, type CheerioAPI } from "cheerio";
import type { ImageLink, SnaptikJson } from "../interfaces/snaptik.type";

export default (decoded: string): SnaptikJson => {
    const $: CheerioAPI = load(decoded);

    // gather data
    const author: string = $(".info span").text();
    const description: string = $(".info .video-title").text();

    // video
    const videoLinks: string[] = []
    $(".video-links").map((_, link) => {
        const linkHD: string | undefined = $(link).find("button").attr("data-backup");

        $(link).find("a").each((_, a) => {
            const url: string | undefined = $(a).attr("href");

            if (url !== undefined && url !== "/" && !url.includes("play.google.com")) {
                videoLinks.push(url?.startsWith("/file") ? "https://snaptik.app" + url : url)
            }
        }).get();

        if (linkHD !== undefined) {
            videoLinks.push(linkHD);
        }
    }).get();

    // image
    const imageLinks: ImageLink[] = $(".column.is-one-third .photo")
        .map((_, img) => {
            const thumbnail: string = $(img).find("img").attr("src") || "";
            const url: string = $(img).find("a").attr("href") || "";

            return { thumbnail, url };
        })
        .get();

    return { author, description, videoLinks, imageLinks }
};
