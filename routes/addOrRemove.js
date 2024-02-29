const express = require('express');
const { google } = require('googleapis');
const app = express();
const { addURL } = require('../controllers/socialUrls/addURL');
const { deleteMany } = require('../controllers/socialUrls/deleteMany');
const { Info } = require('../controllers/socialUrls/info');
const { deleteURL } = require('../controllers/socialUrls/removeURL');

const revivingSoulzUrlModel = require('../models/revivingSoluz/URLmodel');

const addInitiator = async (url, name, model, req, res) => {
    const add = await addURL(url, name, model)
    if (add.state) {
        res.status(200).json({ message: add.message || "Success", doc: add?.doc || {} })
    }
    else {
        res.status(401).json({ message: add.message || "error" })
    }
}
app.post('/addURL', async (req, res) => {
    try {

        const { url, appId } = req.query || "";
        if (!appId) {
            return res.status(400).json({ message: "require APP ID" })
        }
        if (appId === "1584356593") {
            return await addInitiator(url, "revivingSoulz", revivingSoulzUrlModel, req, res)
        }
        else {
            return res.status(401).json({ message: "please, provide valid App ID" })
        }
    } catch (error) {
        res.status(400).json({ message: "Internal server error, contact developer" })
    }
});

// Endpoint to remove URLs uploaded to every social media platform

const clearURLInitiator = async (name, model, req, res) => {
    const deleter = await deleteMany(name, model)
    if (deleter.state) {
        res.status(200).json({ message: deleter.message || "Success" })
    }
    else {
        res.status(401).json({ message: deleter.message || "error" })
    }

}
app.delete('/clearURL', async (req, res) => {
    try {

        const { appId } = req.query || {};
        if (!appId) {
            return res.status(400).json({ message: "require APP ID" })
        }
        if (appId === "1584356593") {
            return await clearURLInitiator("revivingSoulz", revivingSoulzUrlModel, req, res)
        }
        else {
            return res.status(401).json({ message: "please, provide valid App ID" })
        }
    } catch (error) {
        return res.status(400).json({ message: "Internal server error, contact developer" })
    }
});

const infoInitiator = async (model, req, res) => {
    const info = await Info(model)
    if (info.state) {
        res.status(200).json({ message: info.message || "Success", ...info })
    }
    else {
        res.status(401).json({ message: info.message || "error" })
    }
}
app.get("/info", async (req, res) => {
    try {

        const { appId } = req.query || {};
        if (!appId) {
            return res.status(400).json({ message: "require APP ID" })
        }
        if (appId === "1584356593") {
            return await infoInitiator(revivingSoulzUrlModel, req, res);
        }
        else {
            return res.status(401).json({ message: "please, provide valid App ID" })
        }
    } catch (error) {
        return res.status(400).json({ message: "Internal server error, contact developer" })
    }
})

const removeURLInitiator = async (url, model, name, req, res) => {
    const deleteMany = await deleteURL(url, model, name)
    if (deleteMany.state) {
        return res.status(200).json({ message: deleteMany.message || "Success" })
    }
    else {
        return res.status(401).json({ message: deleteMany.message || "error" })
    }
}
app.delete("/removeURL", async (req, res) => {
    try {
        const { url, appId } = req.query;
        if (!url) {
            return res.status(401).json({ message: "URL to de bhadwe" })
        }
        if (appId === "1584356593") {
            return await removeURLInitiator(url, revivingSoulzUrlModel, "revivingSoulz", req, res)
        }
        else {
            return res.status(401).json({ message: "please, provide valid App ID" })
        }

    } catch (error) {
        res.status(401).json({ messsage: `${error.message}, Contact developer` || "Server Error, Contact developer" })
    }
})
module.exports = app;

