
var Employee = require('./employee.model');

exports.getEmployees = async (req, res) => {
    try{
        let employees = await Employee.find({}).populate([
            {
                path: 'user',
                model: "User",
            }
        ]);
        
        if(employees) {
            return res.status(202).json(employees);
        }else {
            return res.status(400).json({message: 'An error has occured!'});
        }
    }catch (error) {
        return res.status('400').send(error);
    }

};

exports.getEmployee = async (req, res) => {
    try {
        let employee = await Employee.findById({_id: req.params.id}).populate([
            {
                path: 'user',
                model: "User",
            }
        ])

        if(employee) {
            return res.status(202).json(employee);
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }
    } catch (error) {
        return res.status(400).send({message: "User not found."});
    }
};


exports.createEmployee = async (req, res) => {
    try{
        let {user, jobName} = req.body;

        let employee = await Employee.create({user, jobName});

        if(employee) {
            return res.status(202).json({message: 'Employee created!', data: employee});
        }else {
            return res.status(400).json({message:'An error has occured.'});
        }
    } catch (error) {
        return res.status(400).send({message: "User not created."});
    }
}

exports.updateEmployee = async(req, res) =>{
    try{
        let newEmployee = req.body;
    let employeeId = req.params.id;
    const updatedEmployee =  await employee.findByIdAndUpdate(mongoose.Types.ObjectId(employeeId),{$set: newEmployee}, {new:true})
    if(updatedEmployee){
        return res.status(202).json({message:"Employee updated!", data: updatedEmployee})
    } else {
        return res.status(400).json({message: "An error occured!"})
    }

    }catch(err){
        return res.status(400).json(err.message)
    } 
}

exports.deleteEmployee = async (req,res) =>{
    try{
        let employeeDeleted = await Employee.deleteOne({_id:req.params.id})
        if(employeeDeleted.n > 0){
            return res.status(200).json({message:'Employee was deleted!'})
        } else {
            return res.status(400).json({message:"Error Message!"})
        }
    } catch(err){
        return res.status(400).json(err.message)
    }
}