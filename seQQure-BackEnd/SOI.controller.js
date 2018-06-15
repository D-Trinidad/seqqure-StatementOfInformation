const responses = require("../models/responses");
const SOI = require("../services/SOI.service");
const apiPrefix = "/api/infoStatements";

module.exports = {
  create: create,
  readAll: readAll,
  readById: readById,
  escrowIdMatchPeopleId: escrowIdMatchPeopleId,
  update: update
};

function create(req, res) {
  console.log(req.body);
  SOI.create(req.body)
    .then(id => {
      const responseModel = new responses.ItemResponse();
      responseModel.id = id;
      res
        .status(201)
        .location(`${apiPrefix}/${id}`)
        .json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function readAll(req, res) {
  SOI.readAll(req.body.tenantId)
    .then(soi => {
      res.json(new responses.ItemsResponse(soi));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function readById(req, res) {
  SOI.readById(req.params.id)
    .then(soi => {
      res.json(new responses.ItemResponse(soi));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}
function escrowIdMatchPeopleId(req, res) {
  SOI.escrowIdMatchPeopleId(req.params.id)
    .then(soi => {
      res.json(new responses.ItemResponse(soi));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}
function update(req, res) {
  SOI.update(req.model)
    .then(response => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}
