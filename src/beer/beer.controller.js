var Beer = require('./beer.model')
// const {uploadImage} = require('../utils/uploadImage');
const cloudinary = require('cloudinary').v2;
const fs = require('fs') ;

exports.getAllBeers = async (req, res) => {
    try{
        
        let beers = await Beer.find({});
        
        if(beers) {
            return res.status(202).json(beers);
        }else {
            return res.status(400).json({message: 'An error has occured!'});
        }
    }catch (error) {
        return res.status('400').send(error);
    }

};

exports.filterBeersByName = async (req, res) => {
  try {
    let beers = await Beer.find({
      beerName: { $regex: `.*${req.query.beerName}.*`, $options: "i" },
    });
    if (beers) {
      return res.status(202).json(beers);
    } else {
      return res.status(400).json({ message: "An error has occured." });
    }
  } catch (error) {
    return res.status("400").send(error);
  }
};

exports.getBeerById = async (req, res) => {
    try{
        
        let beer = await Beer.findById({_id: req.params.id});
        
        if(beer) {
            return res.status(202).json(beer);
        }else {
            return res.status(400).json({message: 'An error has occured!'});
        }
    }catch (error) {
        return res.status('400').send(error);
    }

};


exports.getBeerByName = async (req, res) => {
    try{
        
        let beer = await Beer.find({name: req.query.name});
        
        if(beer) {
            return res.status(202).json(beer);
        }else {
            return res.status(400).json({message: 'An error has occured!'});
        }
    }catch (error) {
        return res.status('400').send(error);
    }

};


exports.createBeer = async (req, res) => {
    try{
        let {beerName, beerDescription, beerAlc, file} = req.body;

        file = file.split(';base64,').pop();

        fs.writeFile('image.png', file, {encoding: 'base64'}, function(err) {
            if(err) return res.status(400).send('erro to create the file');
            cloudinary.uploader.upload('image.png', async function(error, result) {
                if(error) {
                    return res.status(400).send('erro to upload image to the cloudinary');
                }
                let beerPicture = result.url;
                try {
                    let beer = await Beer.create({beerName, beerDescription,beerAlc, beerPicture});
                    if(beer) {
                        return res.status(202).json({message: 'Beer created!', data: beer});
                    }else {
                        return res.status(400).json({message:'An error has occured.'});
                    }
                } catch (error) {
                    return res.status(400).json({message: error});
                }
                
               
            });

        });

        
    } catch (error) {
        return res.status(400).send({message: "Beer not created."});
    }
}

exports.updateBeer = async(req, res) =>{
    try{
        let {beerName, beerDescription,beerAlc, beerVotes} = req.body;
        let beerId = req.params.id;
        const updatedBeer =  await beer.findByIdAndUpdate(mongoose.Types.ObjectId(beerId),{$set: {
            beerName,
            beerDescription,
            beerAlc,
            beerVotes
        }}, {new:true})
        if(updatedBeer){
            return res.status(202).json({message:"Beer updated!", data: updatedBeer})
        } else {
            return res.status(400).json({message: "An error occured!"})
        }

    }catch(err){
        return res.status(400).json(err.message)
    } 
}

exports.deleteBeer = async (req,res) =>{
    try{
        let beerDeleted = await Beer.deleteOne({_id:req.params.id})
        if(beerDeleted.n > 0){
            return res.status(200).json({message:'Beer was deleted!'})
        } else {
            return res.status(400).json({message:"Error Message!"})
        }
    } catch(err){
        return res.status(400).json(err.message)
    }
}