const {
  savefrom,
  snapinsta,
  snapsave,
  snaptik,
  musicaldown,
  snaptwitter,
} = require(".");

(async () => {
  const tiktok = await snaptik(
    "https://www.tiktok.com/@initokyolagii/video/7189917930761506075"
  );
  console.info(tiktok);

  const youtube = await savefrom("https://www.youtube.com/shorts/8dYeTq_qiIQ");
  console.info(youtube);

  const instagram = await snapinsta(
    "https://www.instagram.com/reel/CqIWB6LA8BS/?igshid=YmMyMTA2M2Y="
  );
  console.info(instagram);

  const facebook = await snapsave("https://fb.watch/jtgwcUWL68/");
  console.info(facebook);

  const tiktokv = await musicaldown(
    "https://www.tiktok.com/@initokyolagii/video/7189917930761506075",
    false // set 'true' if you want to get music too
  );
  console.info(tiktokv);

  const twitter = await snaptwitter(
    "https://twitter.com/sarahlou_7491/status/1638442355920347138?s=20"
  );
  console.info(twitter);
})();
