const cloudinary = require('cloudinary').v2;
const fs = require('fs') ;




exports.uploadImage =  async function (base64Image, path, res){
    try {
        base64Image = base64Image.split(';base64,').pop();

        let file = await fs.writeFile('image.png', base64Image, {encoding: 'base64'});
        return  cloudinary.uploader.upload('image.png', );
       
    } catch (error) {
        res.status(400).send('error to upload image')
        console.log(error)
    }
    
}