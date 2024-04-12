const revivingSoulz = "1584356593";
const animeto = "1231454352";
const redito = "1357843254";
const missoginie = "1923844210";
const userData = {
  "ritikbkl152@gmail.com": {
    password: "password@123",
    apps: [{ name: "Animeto", id: animeto }],
  },
  admin: {
    password: "ankitsabkapapa@123",
    apps: [
      { name: "Animeto", id: animeto },
      { name: "Redito", id: redito },
      { name: "Reviving Soulz", id: revivingSoulz },
    ],
  },
  testing: {
    password: "testinghoribc",
    apps: [{ name: "Reviving Soulz", id: revivingSoulz }],
  },
  dhruv: {
    password: "missoginie@123",
    apps: [{ name: "missoginie", id: missoginie }],
  },
};

const sparks = {
  revivingSoulz,
  animeto,
  redito,
  missoginie,
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
    active,
    appSecret,
    appID
  ) {
    this.pageAccessToken = pageAccessToken;
    this.fbUserId = fbUserId;
    this.IgUserId = IgUserId;
    this.name = name;
    this.model = model;
    this.titles = titles;
    this.tags = tags;
    this.active = active;
    this.appSecret = appSecret;
    this.appID = appID;
  }
}

//generals
const { animetoTags, reditoTags, missoginieTags } = require("../assets/tags");
const {
  revivingSoulzTiles,
  reditoTitles,
  animetoTitles,
  missoginieTitles,
} = require("./titles");

//revigingSoulz
const UrlModelRevSoulz = require("../models/revivingSoluz/URLmodel");
let revivingSoulzPageAccessToken =
  "EAAJ2lhUzpvMBOxUp0sM9ojxxX5JOU7OXulSH3LdXkLVuNYLro973EPZBqVzZCy6MhbbX3OLFOXERY0GpdiV7gRIUvsuJ3sm0w7OK1QKDdoTaLD82yMTmP7NHgCAC1LxCd3Pk0flHE0JYA2eKYW6DjzIb6PT9wmZB5NNGUkvZAxxJJwxbJT1pWzngIXoYqq2SKPTufs7f4nnqAuAZD";
let revivingSoulzFbUserId = "201428166395003";
let revivingSoulzIgUserId = "17841464678870993";
let revivingSoulzFBAppID = "693336926299891";
let revivingSoulzFBAppSecret = "f4b3d6ab886f041f78d5b8cc11c0f7d5";

// animeto
const AnimetoModel = require("../models/animeto/URLmodel");
let animetoPageAccessToken =
  "EAAK69zoePbMBO2bMMV4EX2OkYVZCbxkDYzZAmmCo0zDATVJFXqKdCPr4Edbn7qmWCJpkq32KRZCFTPI1Ct7Ewh8iieljA4xKGEjnYjTpfjWDEgwk1wHyyhh551PH9U8QrXmbPD4Ywl5s8ZBjBP9ZAJCZC8Lc2jnYBzyaUdxKTrpkyrTFuVg6avV4PjPE0fb9tuE8BovZB1RDaEZCcZCgZD";
let animetoFbUserId = "278856668633727";
let animeIgUserId = "17841465133015574";
let animeFBAppId = "768520948170163";
let animeFBAppSecret = "cc10f1cdc85a37c79ac5eb65bfa538aa";

// redito
const ReditoModel = require("../models/redito/URLmodel");
let reditoPageAccessToken =
  "EAAF6FTVT2xABO82yHrYOlZCMY1zDS9LgJrIttMfaA2kNnwg3S2C7dZBhiAbN1FAQdZAncWmwb2SE6uTOHCY4ir16465CwCcOjOLk2Qyu4n6LtZAZCSD7uwjF6bZBUFjDNJsSSPH6lQR4DtNArlcduADpkspMGdmZAeiOB6pNNlrhJVsdxehuVokPwgJ5bE8LZAgUQr2XiHZBrlcFa9ywZD";
let redditoFbUserId = "249669224895258";
let reditoIgUserId = "17841464791716146";
let reditoFBAppId = "415706484300560";
let reditoFBAppSecret = "7af8fa769433e064daf36016550550fe";

// missoginie
const MissoGinieModel = require("../models/missoginie/URLmodel");
let missoginiePageAccessToken =
  "EAAP1DGhkaE8BO4J8zImzhylkIrLTdkDD5wq8NifwZCCtZAn1ygP2idw1IBZARM6YZBxlBFwzcekgsiZB746TzUz7ZAa0H9eZCLajUyuwvP9uZCpRIl2ZC3ztSA69tsUvw0skrIorCiPVteB2wzzc9RtqF6bESZBDIfZCzH1UKFZCFHiSLDEZCJBaInPv5k498PyBxh5ndXDFhZBZCmMQ5IVNZBQZD";
let missoginieFbUserId = "234490476423553";
let missoginieIgUserId = "17841465892488198";
let missoginieFBAppId = "1113858569955407";
let missoginieFBAppSecret = "ff6ca692f2e596232c52d7faccfbac73";

const instances = {
  [sparks.revivingSoulz]: new SocialData(
    revivingSoulzIgUserId,
    revivingSoulzFbUserId,
    revivingSoulzPageAccessToken,
    "revivingSoulz",
    UrlModelRevSoulz,
    revivingSoulzTiles,
    animetoTags,
    false,
    revivingSoulzFBAppSecret,
    revivingSoulzFBAppID
  ),
  [sparks.animeto]: new SocialData(
    animeIgUserId,
    animetoFbUserId,
    animetoPageAccessToken,
    "animeto",
    AnimetoModel,
    animetoTitles,
    animetoTags,
    true,
    animeFBAppSecret,
    animeFBAppId
  ),
  [sparks.redito]: new SocialData(
    reditoIgUserId,
    redditoFbUserId,
    reditoPageAccessToken,
    "redito",
    ReditoModel,
    reditoTitles,
    reditoTags,
    true,
    reditoFBAppSecret,
    reditoFBAppId
  ),
  [sparks.missoginie]: new SocialData(
    missoginieIgUserId,
    missoginieFbUserId,
    missoginiePageAccessToken,
    "missoginie",
    MissoGinieModel,
    missoginieTitles,
    missoginieTags,
    true,
    missoginieFBAppSecret,
    missoginieFBAppId
  ),
};
module.exports = { instances, userData };
