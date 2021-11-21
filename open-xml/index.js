const _ = require('lodash');
const parse = require('xml2js').parseString;
var admZip = require("adm-zip");

const APP_XML_JSON = require('./app.xml.json');
const CORE_XML_JSON = require('./core.xml.json');
const APP_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties 
    xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" 
    xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
</Properties>`
const CORE_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties 
    xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" 
    xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" 
    xmlns:dcmitype="http://purl.org/dc/dcmitype/" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
</cp:coreProperties>`;

const getMetadata = async (buffer) => {
    let data = {};
    if (!buffer || buffer === null)
        throw "parameter name 'buffer' could not be undefined or null";

    try {
        var zip = new admZip(buffer);
        var zipEntries = zip.getEntries();

        for (const key in zipEntries) {
            const zipEntry = zipEntries[key];
            switch (zipEntry.entryName) {
                case "docProps/app.xml": {
                    const xml = zipEntry.getData().toString();
                    const json = await parseEntryXml(xml);
                    _.assign(data, getProperties(json, APP_XML_JSON));
                    console.log(data);
                    break;
                }
                case "docProps/core.xml": {
                    const xml = zipEntry.getData().toString();
                    const json = await parseEntryXml(xml);
                    _.assign(data, getProperties(json, CORE_XML_JSON));
                    console.log(data);
                    break;
                }
                default:
                    break;
            }
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
    const sorted = sortByKeys(data);
    return sorted;
}

const clearMetadata = async (buffer) => {
    try {
        var zip = new admZip(buffer);
        var zipEntries = zip.getEntries();

        for (const key in zipEntries) {
            const zipEntry = zipEntries[key];
            switch (zipEntry.entryName) {
                case "docProps/app.xml": {
                    zipEntry.setData(APP_XML);
                    break;
                }
                case "docProps/core.xml": {
                    zipEntry.setData(CORE_XML);
                    break;
                }
                default:
                    break;
            }
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
    return zip.toBuffer();
}

const updateMetadata = async (buffer, metadata) => {
    throw 'updateMetadata is not implemented';
}

const parseEntryXml = (xml) => {
    return new Promise((resolve, reject) => {
        parse(xml, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

const getProperties = (obj, props) => {

    let data = {};

    _.forEach(props, (prop) => {
        if (_.has(obj, prop.path)) {

            switch (prop.type) {
                case "number":
                    val = _.toNumber(_.get(obj, prop.path));
                    break;
                case "string":
                default:
                    val = _.toString(_.get(obj, prop.path));
            }

            if (prop.type == "string" && _.isEmpty(val)) return;

            _.set(data, prop.name, val);

        }

    });

    return data;
}

const sortByKeys = object => {
    const keys = Object.keys(object)
    const sortedKeys = _.sortBy(keys)

    return _.fromPairs(
        _.map(sortedKeys, key => [key, object[key]])
    )
}

module.exports = {
    getMetadata: getMetadata,
    updateMetadata: updateMetadata,
    clearMetadata: clearMetadata
}