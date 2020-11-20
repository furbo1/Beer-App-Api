var Beer = require('./beer.model')


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

exports.getProducts = async (req, res) => {   
     try { let products =  await Product.find({ title: { '$regex': `.*${req.query.title}.*`, '$options': 'i' }} );       
      if(products) {
          return res.status(202).json(products);}
      else {return res.status(400).json({message:'An error has occured.'}); }} 
      catch (error) { 
          return res.status('400').send(error); }};




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
        let {beerName, beerDescription, beerAlc, beerPicture} = req.body;

        let beer = await Beer.create({beerName, beerDescription,beerAlc, beerPicture});

        if(beer) {
            return res.status(202).json({message: 'Beer created!', data: beer});
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }
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