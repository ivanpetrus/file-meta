const pdf = require('pdf-lib');

const getMetadata = async (buffer) => {
    const pdfDoc = await pdf.PDFDocument.load(buffer, {
        updateMetadata: false
    })

    return {
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        creator: pdfDoc.getCreator(),
        keywords: pdfDoc.getKeywords(),
        producer: pdfDoc.getProducer(),
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate()
    }

}

const clearMetadata = async (buffer) => {
    const pdfDoc = await pdf.PDFDocument.load(buffer, {
        updateMetadata: false
    });

    pdfDoc.setTitle('')
    pdfDoc.setAuthor('')
    pdfDoc.setSubject('')
    pdfDoc.setKeywords([])
    pdfDoc.setProducer('')
    pdfDoc.setCreator('')
    // pdfDoc.setCreationDate(null)
    // pdfDoc.setModificationDate(null);
    const pdfBytes = await pdfDoc.save()
    return pdfBytes;

}

const updateMetadata = async (buffer, metadata) => {
    throw 'updateMetadata is not implemented';
}



module.exports = {
    getMetadata: getMetadata,
    updateMetadata: updateMetadata,
    clearMetadata: clearMetadata
}