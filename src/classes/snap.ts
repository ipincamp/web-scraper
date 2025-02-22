export class Snap {
    private base64Chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
    private zero: string = "0";

    private getArgs(response: string): (string | number)[] {
        const params = response.match(/escape\(r\)\)}\((.*?)\)\)/);

        if (params === null) {
            throw new Error("Failed to get video params");
        }

        const args = params[1]
            .split(',')
            .map(a => a.startsWith('"') && a.endsWith('"') ? a.slice(1, -1) : +a);

        if (args.length !== 6) {
            throw new Error("Failed to get args");
        }

        return args;
    }

    private decode(s: string, e: number, f: number): string {
        const base64: string[] = this.base64Chars.split("");
        const h: string[] = base64.slice(0, e);
        const i: string[] = base64.slice(0, f);
        let j: number = s
            .split("")
            .reverse()
            .reduce((a: number, b: string, c: number) => {
                if (h.indexOf(b) !== -1) {
                    return (a += h.indexOf(b) * Math.pow(e, c));
                }
                return a;
            }, 0);
        let k: string = "";
        while (j > 0) {
            k = i[j % f] + k;
            j = Math.floor(j / f);
        }
        return k || this.zero;
    }

    /**
     * Decode the script
     */
    protected decoder(script: string): string | null {
        let [h, u, n, t, e, r] = this.getArgs(script) as [string, any, string, number, number, string];
        try {
            r = "";
            for (let i = 0, len = h.length; i < len; i++) {
                let s = "";
                while (h[i] !== n[e]) {
                    s += h[i];
                    i++;
                }
                for (let j = 0; j < n.length; j++) {
                    s = s.replace(new RegExp(n[j], "g"), j.toString());
                }
                r += String.fromCharCode(+this.decode(s, e, 10) - t);
            }
            return decodeURIComponent(escape(r));
        } catch {
            return null;
        }
    }
}
