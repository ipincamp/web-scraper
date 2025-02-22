import axios from "axios";
import { Snap } from "./snap";
import { load } from "cheerio";
import FormData from "form-data";

interface InstagramJson {
    source: string;
    author: string;
    authorUrl: string;
    media: {
        type: string;
        link: string;
    }[];
}

export class Instagram extends Snap {
    protected instagramUrl: string;
    protected snapinstUrl = "https://snapinst.app";
    protected userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";

    constructor(url: string) {
        super();
        this.instagramUrl = url;
    }

    /**
     * Parse the result from snapinst.app
     *
     * @param result Result from snapinst.app
     * @returns InstagramJson
     */
    private snapinsParser(decoded: string): InstagramJson {
        const html = decoded.match(/innerHTML = "(.*?)";/)?.[1];

        if (!html) {
            throw new Error("Failed to get the result");
        }

        const $ = load(html.replace(/\\/g, ""));

        return {
            source: "snapinst",
            author: $("div.download-top div.left").first().text().trim(),
            authorUrl: $("div.download-top img").attr("src") as string,
            media: $("a.btn.download-media.flex-center")
                .map((_, a) => ({
                    type: $(a).text().trim().split(" ")[1].toLowerCase(),
                    link: $(a).attr("href") as string,
                }))
                .get()
                .map(({ type, link }) => {
                    const dlIndex = link.indexOf("dl=1");

                    if (dlIndex !== -1) {
                        const firstPart = link.slice(0, dlIndex + 4);
                        const remainingPart = link.slice(dlIndex + 4).replace(/&dl=1/g, "");
                        const modifiedLink = firstPart + remainingPart;

                        link = modifiedLink;
                    }

                    return { type, link };
                }),
        };
    }

    /**
     * Get Instagram media from snapinst.app
     *
     * @returns InstagramJson
     */
    public async snapinst(): Promise<InstagramJson> {
        try {
            const requestToken = await axios({
                method: 'GET',
                url: `${this.snapinstUrl}/id`,
                headers: {
                    "User-Agent": this.userAgent
                }
            })

            if (requestToken.status !== 200) {
                throw new Error('Failed to get tokens');
            }

            const data = new FormData();
            const $ = load(requestToken.data);

            $("form input").map((_, { attribs }) => {
                const { name, value } = attribs;
                data.append(name, name === "url" ? this.instagramUrl : value);
            })

            const requestScript = await axios({
                method: "POST",
                url: `${this.snapinstUrl}/action2.php`,
                data,
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
                    Origin: this.snapinstUrl,
                    Referer: `${this.snapinstUrl}/id`,
                    "User-Agent": this.userAgent
                }
            })

            if (requestScript.status !== 200) {
                throw new Error("Failed to get the script");
            }

            const decoded = this.decoder(requestScript.data);

            if (!decoded) {
                throw new Error("Failed to get video params");
            }

            return this.snapinsParser(decoded);
        } catch (error: any) {
            throw new Error(error);
        }
    }
}
