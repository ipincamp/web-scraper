const base64Chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
const zero: string = "0";

function decode(s: string, e: number, f: number): string {
    const base64: string[] = base64Chars.split("");
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
    return k || zero;
}

export default (h: string, u: any, n: string, t: number, e: number, r: string): string | null => {
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
            r += String.fromCharCode(+decode(s, e, 10) - t);
        }
        return decodeURIComponent(escape(r));
    } catch {
        return null;
    }
};
