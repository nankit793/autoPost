const revivingSoulz = "1584356593";
const animeto = "1231454352";
const redito = "1357843254";

const userData = {
  "ritikbkl152@gmail.com": {
    password: "password@123",
    apps: [animeto, redito, revivingSoulz],
  },
};

const sparks = {
  revivingSoulz,
  animeto,
  redito,
};

class SocialData {
  constructor(
    IgUserId,
    fbUserId,
    pageAccessToken,
    name,
    model,
    titles,
    tags,
    active
  ) {
    this.pageAccessToken = pageAccessToken;
    this.fbUserId = fbUserId;
    this.IgUserId = IgUserId;
    this.name = name;
    this.model = model;
    this.titles = titles;
    this.tags = tags;
    this.active = active;
  }
}

//generals
const { animetoTags, reditoTags } = require("../assets/tags");
const { revivingSoulzTiles, reditoTitles, animetoTitles } = require("./titles");

//revigingSoulz
const UrlModelRevSoulz = require("../models/revivingSoluz/URLmodel");
let revivingSoulzPageAccessToken =
  "EAAJ2lhUzpvMBOxUp0sM9ojxxX5JOU7OXulSH3LdXkLVuNYLro973EPZBqVzZCy6MhbbX3OLFOXERY0GpdiV7gRIUvsuJ3sm0w7OK1QKDdoTaLD82yMTmP7NHgCAC1LxCd3Pk0flHE0JYA2eKYW6DjzIb6PT9wmZB5NNGUkvZAxxJJwxbJT1pWzngIXoYqq2SKPTufs7f4nnqAuAZD";
let revivingSoulzFbUserId = "201428166395003";
let revivingSoulzIgUserId = "17841464678870993";

// animeto
const AnimetoModel = require("../models/animeto/URLmodel");
let animetoPageAccessToken =
  "EAAK69zoePbMBOZCe7dy1fKBcHVigcsMySQ67nXu8ZAx8zAv0un3vPXO56n0EZCB7eDLuEtxB2S0wPiNRYCU6x6Sl4KDPUvVKlGDHkVJspVQj3JtsFYY2TRNZBcFBVjM6sN6Pc2D1WBE2pVBUzHIHKTGZCLozQyXf11PH78XljuHsEsZB6oe1nLzV2BICkbMbZADZC5lCuVy6cWtoONJfZCpMEIS16HtEHhDXD2vtcPoUZD";
let animetoFbUserId = "278856668633727";
let animeIgUserId = "17841465133015574";

// redito
const {} = require("../assets/tags");
const ReditoModel = require("../models/redito/URLmodel");
let reditoPageAccessToken =
  "EAAF6FTVT2xABO1uZCQEvDbYPpQcJCIQ3firKsZCwvtc5nGovZCoRvYZCh0LZAK3k7huLBV0WAyIZAapiNZAelPV6qvpJO62CZBDeAnFq3Rhtxr2MFfc7PymG5PyPlYH3ZBRXSUdaZCa16Psr6ZA2KVCTImGbVMfyNTIYQOy560Om7FUQtYgoZBLNimxlOEtdeIhl7KdEIo94P4lLZCeXlgPBqQHnym3T62QEmAVBQ2FlicP0ZD";
let redditoFbUserId = "249669224895258";
let reditoIgUserId = "17841464791716146";

const instances = {
  [sparks.revivingSoulz]: new SocialData(
    revivingSoulzIgUserId,
    revivingSoulzFbUserId,
    revivingSoulzPageAccessToken,
    "revivingSoulz",
    UrlModelRevSoulz,
    revivingSoulzTiles,
    animetoTags,
    true
  ),
  [sparks.animeto]: new SocialData(
    animeIgUserId,
    animetoFbUserId,
    animetoPageAccessToken,
    "animeto",
    AnimetoModel,
    animetoTitles,
    animetoTags,
    true
  ),
  [sparks.redito]: new SocialData(
    reditoIgUserId,
    redditoFbUserId,
    reditoPageAccessToken,
    "redito",
    ReditoModel,
    reditoTitles,
    reditoTags,
    true
  ),
};
module.exports = { instances, userData };
