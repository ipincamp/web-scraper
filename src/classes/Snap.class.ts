class Snap {
  private codes: (d: string, e: number, f: number) => string;
  private decoder: (
    h: string,
    u: number,
    n: string,
    t: number,
    e: number,
    r: number | string
  ) => string;

  constructor() {
    this.codes = (d: string, e: number, f: number): string => {
      let g =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split(
          ''
        );
      let h = g.slice(0, e);
      let i = g.slice(0, f);
      let j = d
        .split('')
        .reverse()
        .reduce(function (a, b, c) {
          if (h.indexOf(b) !== -1) return (a += h.indexOf(b) * Math.pow(e, c));
          return a;
        }, 0);
      let k = '';
      while (j > 0) {
        k = i[j % f] + k;
        j = (j - (j % f)) / f;
      }
      return k || '0';
    };

    this.decoder = (
      h: string,
      u: number,
      n: string,
      t: number,
      e: number,
      r: number | string
    ): string => {
      r = '';
      for (let i = 0, len = h.length; i < len; i++) {
        let s = '';
        while (h[i] !== n[e]) {
          s += h[i];
          i++;
        }
        for (let j = 0; j < n.length; j++)
          s = s.replace(new RegExp(n[j], 'g'), j.toString());
        r += String.fromCharCode(+this.codes(s, e, 10) - t);
      }
      return decodeURIComponent(escape(r));
    };
  }

  decode(script: string): string {
    // check the script for decode
    const hasScript = script.match(/\}eval\(function\(/) !== null;
    if (!hasScript) throw new Error('Decoding script not found');

    // decode script
    const arrOfParams = script.match(/escape\(r\)\)\}\((.*?)\)\)/);
    const hasParams = arrOfParams !== null;
    if (!hasParams) throw new Error('Parameter value not found');

    const [h, u, n, t, e, r] = arrOfParams[1].split(',').map((value) => {
      return value.includes('"') ? value.slice(1, -1) : +value;
    });

    return this.decoder(
      h as string,
      u as number,
      n as string,
      t as number,
      e as number,
      r
    );
  }
}

export default new Snap();
