const deleteDocsFromDrive = async (documentsToDelete, drive) => {
    documentsToDelete.forEach((doc) => {
        drive.files.delete({
            fileId: doc.driveFileId
        }, (err, res) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted:', doc.driveFileId);
            }
        });
    });
}
module.exports = { deleteDocsFromDrive }