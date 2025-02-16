import axios from "axios";
import FormData = require("form-data");
import { load } from "cheerio";
import { Snap } from "./snap";

interface TikTokJson {
    author: string;
    caption: string;
    media: {
        video: string[];
        music: string[];
        photo: string[];
    }
}

export class TikTok extends Snap {
    protected tiktokUrl: string;
    protected userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";
    protected ssstikUrl = "https://ssstik.io";
    protected snaptikUrl = "https://snaptik.app";

    constructor(url: string) {
        super();
        this.tiktokUrl = url;
    }

    /**
     * Parse the result from ssstik.io
     *
     * @param result Result from ssstik.io
     * @returns TikTokJson
     */
    private ssstikParser(result: string): TikTokJson {
        const $ = load(result);

        return {
            author: $("div.pure-u-1.pure-u-sm-1-2 h2").text(),
            caption: $("div.pure-u-18-24 p").text().trim(),
            media: {
                video: $('div#dl_btns a')
                    .filter((_, a) => !$(a).text().includes("MP3"))
                    .map((_, a) => $(a).attr('href'))
                    .filter((_, href) => href !== '#')
                    .get(),
                music: $('div.result_overlay_buttons a.music')
                    .map((_, a) => $(a).attr('href'))
                    .filter((_, href) => href !== '#')
                    .get(),
                photo: $('li.splide__slide a.pure-button')
                    .map((_, a) => $(a).attr('href'))
                    .get(),
            }
        }
    }

    /**
     * Get TikTok media from ssstik.io
     *
     * @returns TikTokJson
     */
    public async ssstik(): Promise<TikTokJson> {
        try {
            const requestToken = await axios({
                method: "GET",
                url: `${this.ssstikUrl}/en`,
                headers: {
                    "User-Agent": this.userAgent,
                }
            })

            if (requestToken.status !== 200) {
                throw new Error("Failed to get tokens");
            }

            const data = new FormData();
            const token = `${requestToken.data}`.match(/s_tt = '(.*?)'/)?.[1] as string;

            if (!token) {
                throw new Error("Token not found");
            }

            const $ = load(requestToken.data);
            $("form input").map((_, { attribs }) => {
                const { name, value } = attribs;
                data.append(name, name === "id" ? this.tiktokUrl : value);
            });
            data.append("tt", token);

            const requestData = await axios({
                method: "POST",
                url: `${this.ssstikUrl}/abc?url=dl`,
                data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    Origin: this.ssstikUrl,
                    Referer: `${this.ssstikUrl}/en`,
                    "User-Agent": this.userAgent
                }
            })

            if (requestData.status !== 200) {
                throw new Error("Failed to get the result");
            }

            return this.ssstikParser(requestData.data);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    /**
     * Parse the result from snaptik.app
     *
     * @param result Result from snaptik.app
     * @returns TikTokJson
     */
    private snaptikParser(result: string): TikTokJson {
        const html = result.match(/innerHTML = "(.*?)";/)?.[1];

        if (!html) {
            throw new Error("Failed to get the result");
        }

        const $ = load(html.replace(/\\/g, ""));

        return {
            author: $("div.info span").text().trim(),
            caption: $("div.video-title").text().trim(),
            media: {
                music: [],
                photo: $("div.photo")
                    .map((_, img) => $(img).find("a").attr("href"))
                    .get(),
                video: $("div.video-links")
                    .map((_, links) => {
                        const a = $(links)
                            .find("a")
                            .map((_, a) => $(a).attr("href"))
                            .filter((_, href) => href.includes("rapidcdn"))
                            .get();
                        const b = $(links).find("button").attr("data-backup");

                        return b ? [b, ...a] : a;
                    })
                    .get(),
            }
        }
    }

    /**
     * Get TikTok media from snaptik.app
     *
     * @returns TikTokJson
     */
    public async snaptik(): Promise<TikTokJson> {
        try {
            const requestToken = await axios({
                method: "GET",
                url: `${this.snaptikUrl}/ID`,
                headers: {
                    "User-Agent": this.userAgent,
                }
            })

            if (requestToken.status !== 200) {
                throw new Error("Failed to get tokens");
            }

            const data = new FormData();
            const $ = load(requestToken.data);

            $("form input").map((_, { attribs }) => {
                const { name, value } = attribs;
                data.append(name, name === "url" ? this.tiktokUrl : value);
            });

            const requestData = await axios({
                method: "POST",
                url: `${this.snaptikUrl}/abc2.php`,
                data,
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
                    Origin: this.snaptikUrl,
                    Referer: `${this.snaptikUrl}/ID`,
                    "User-Agent": this.userAgent
                }
            })

            if (requestData.status !== 200) {
                throw new Error("Failed to get the result");
            }

            const decoded = this.decoder(requestData.data);

            if (!decoded) {
                throw new Error("Failed to decode the result");
            }

            return this.snaptikParser(decoded);
        } catch (error: any) {
            throw new Error(error);
        }
    }
}