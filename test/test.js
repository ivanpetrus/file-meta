const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const main = require('../index');

describe('tests with documents', () => {

    // generic tests
    it('getMetadata - should be a function', function () {
        expect(typeof main.getMetadata).to.eql('function');
    });
    it('getMetadata - buffer is undefined', async () => {
        try {
            await main.getMetadata();
        } catch (error) {
            expect(error).equal("parameter name 'buffer' could not be undefined or null");
        }
    });

    it('getMetadata - buffer is null', async () => {
        try {
            await main.getMetadata();
        } catch (error) {
            expect(error).equal("parameter name 'buffer' could not be undefined or null");
        }
    });

    // tests with microsoft xml based documents.
    describe('tests with microsoft documents', () => {
        var docxFile = path.join(__dirname, 'files', 'google.docx');

        it('docx file - get all metadata done', async () => {
            const fileBuff = fs.readFileSync(docxFile);
            const data = await main.getMetadata(fileBuff);
            expect(data).is.not.null;
        });
    });

});