const errors = require("restify-errors");
const Customer = require('../models/Customer')

module.exports = server => {
  //using an async callback function so await becomes available
  //Get customers
  server.get("/customers", async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  //Add Customers
  server.post('/customers', async (req, res, next) => {
    //Check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expexted 'application/json'"))
    }

    const { name, email, balance } = req.body;

    const customer = new Customer({
      name,
      email,
      balance
    });

    try {
      const newCustomer = await customer.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  //Get single customer
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next()
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`There is no customer with the Id of ${req.params.id}`));
    }
  });

  //Update Customer
  server.put('/customers/:id', async (req, res, next) => {
    //Check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expexted 'application/json'"))
    }

    try {
      const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.send(200);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`There is no customer with the Id of ${req.params.id}`));
    }
  });

  //Delete Customer
  server.del('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndRemove({ _id: req.params.id });
      res.send(204);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`There is no customer with the Id of ${req.params.id}`));
    }
  });
};
