import * as moviekuService from './services/movieku.service';
import musicaldownService from './services/musicaldown.service';
import snapinstaService from './services/snapinsta.service';
import snapsaveService from './services/snapsave.service';
import snaptikService from './services/snaptik.service';
import snaptwitterService from './services/snaptwitter.service';
import ssstikService from './services/ssstik.service';
import tikdownService from './services/tikdown.service';
import { writeFileSync } from 'fs'

export {
  moviekuService as movieku,
  musicaldownService as musicaldown,
  snapinstaService as snapinsta,
  snapsaveService as snapsave,
  snaptikService as snaptik,
  snaptwitterService as snaptwitter,
  ssstikService as ssstik,
  tikdownService as tikdown,
};

(async () => {
  // console.info(await moviekuService.seriesList());
  // console.info(
  //   await snaptwitterService(
  //     'https://twitter.com/asumsico/status/1698958151545245810?s=20'
  //   )
  // );
  // console.info(
  //   await ssstikService(
  //     'https://www.tiktok.com/@palpalaa/video/7274442978985250054?_t=8fS7MQRiGB8&_r=1'
  //   )
  // );
  // console.info(
  //   await tikdownService(
  //     'https://www.tiktok.com/@palpalaa/video/7274442978985250054?_t=8fS7MQRiGB8&_r=1'
  //   )
  // );
  // console.info(
  //   await snapsaveService(
  //     'https://www.tiktok.com/@palpalaa/video/7274442978985250054?_t=8fS7MQRiGB8&_r=1'
  //   )
  // );
  // console.info(await musicaldownService(
  //   'https://www.tiktok.com/@palpalaa/video/7274442978985250054?_t=8fS7MQRiGB8&_r=1',
  //   true
  // ));
  const result = await snaptikService(
    'https://www.tiktok.com/@palpalaa/video/0000042978985200000?_t=8fS7MQRiGB8&_r=1'
  )

  writeFileSync('snaptik-error.js', result, 'utf-8')
  //   console.info(await snapinstaService('https://www.instagram.com/p/CwaJCDXpwDy/'))
})();
