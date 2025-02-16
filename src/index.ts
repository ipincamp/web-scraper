import * as moviekuService from "./services/movieku.service";
import * as y2mateService from "./services/y2mate.service";
import saveigService from "./services/saveig.service";
import snapinstaService from "./services/snapinsta.service";
import snapsaveService from "./services/snapsave.service";
import snaptwitterService from "./services/snaptwitter.service";
import tikdownService from "./services/tikdown.service";
import { TikTok } from "./classes/tiktok";

export {
  TikTok,
  moviekuService as movieku,
  saveigService as saveig,
  snapinstaService as snapinsta,
  snapsaveService as snapsave,
  snaptwitterService as snaptwitter,
  tikdownService as tikdown,
  y2mateService as y2mate,
};
