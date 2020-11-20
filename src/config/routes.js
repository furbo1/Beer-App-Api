const userRouter = require('../user/user.router');
const employeeRouter = require('../employee/employee.router');
const beerRouter = require('../beer/beer.router')
//import beerRouter

module.exports = (app) => {
    app.use("/user", userRouter);
    app.use("/employee", employeeRouter);
    app.use("/beer", beerRouter);
    

    //add beerRoute

    app.get("/", function(req, res) {
        res.set('content-type', 'text/html');
        res.send('Great! Welcome to our');
    })
};