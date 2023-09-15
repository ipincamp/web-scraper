export interface IY2mateVideoInfo {
  size: string;
  f: string;
  q: string;
  q_text: string;
  k: string;
}

interface IY2mateLinks {
  mp4: {
    [key: string]: IY2mateVideoInfo;
    auto: IY2mateVideoInfo;
  };
  mp3: {
    [key: string]: IY2mateVideoInfo;
    mp3128: IY2mateVideoInfo;
  };
  other: {
    [key: string]: IY2mateVideoInfo;
  };
}

interface IY2mateRelatedVideo {
  title: string;
  contents: any[];
}

export interface IY2mateVideoData {
  status: string;
  c_status?: string;
  mess: string;
  page: string;
  vid: string;
  extractor: string;
  title: string;
  t: number;
  a: string;
  links: IY2mateLinks;
  related: IY2mateRelatedVideo[];
}

export interface IY2mateApiResponse {
  vid: string;
  thumbnail: string;
  title: string;
  duration: number;
  channel: string;
  formats: {
    itag: string;
    size: string;
    mime: string;
    quality: string;
    label: string;
    token: string;
  }[];
}

export interface IY2mateConvertJson {
  status: string;
  mess: string;
  c_status: string;
  vid: string;
  title: string;
  ftype: string;
  fquality: string;
  dlink: string;
}

export interface IY2mateConvertResponse {
  vid: string;
  title: string;
  mime: string;
  quality: string;
  url: string;
}
