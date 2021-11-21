const openXml = require("./open-xml/index");
const pdf = require("./pdf/index");

module.exports = {
    getMetadata: async (buffer, extension) => {
        let result;
        switch (extension) {
            case 'docx':
            case 'pptx':
            case 'xlsx':
                result = openXml.getMetadata(buffer);
                break;
            case 'pdf':
                result = await pdf.getMetadata(buffer);
                break;
            default:
                throw 'not supported extension'

        }
        return result;
    },

    updateMetadata: async (buffer, extension, metadata) => {
        let result;
        switch (extension) {
            case 'docx':
            case 'pptx':
            case 'xlsx':
                result = openXml.updateMetadata(buffer, metadata);
                break;
            case 'pdf':
                result = await pdf.updateMetadata(buffer, metadata);
                break;
            default:
                throw 'not supported extension'

        }
        return result;
    },
    clearMetadata: async (buffer, extension) => {
        let result;
        switch (extension) {
            case 'docx':
            case 'pptx':
            case 'xlsx':
                result = openXml.clearMetadata(buffer);
                break;
            case 'pdf':
                result = await pdf.clearMetadata(buffer);
                break;
            default:
                throw 'not supported extension'

        }
        return result;
    }
}