const axios = require("axios");
const { ndown } = require("nayan-media-downloader");

const instagramPostLink =
  "https://www.instagram.com/p/C5Q47zXgXOy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==";

async function getPostLink(url) {
  let URL = await ndown(instagramPostLink);

  console.log(URL);
}

async function getCaption(url) {
  url = url + "embed" + "/captioned";

  let res = axios.get(url).then((response) => {
    let caption = getCaptionFromHtml(response.data);

    return caption;
  });

  return res;
}

async function getCaptionFromHtml(html) {
  const root = parse(html);

  let caption = root.querySelector(".Caption")?.text;
  if (caption == undefined) caption = "No caption";

  caption = caption.replace("view all comments", "");
  return caption;
}

function getVideoLinkFromHtml(html) {
  let crop =
    '{"' +
    html.substring(html.search("video_url"), html.search("video_url") + 1000);

  crop = crop.substring(0, crop.search(",")) + "}";

  return JSON.parse(crop).video_url;
}

(async () => {
  const a = await getPostLink(instagramPostLink);
  console.log(a);
})();
