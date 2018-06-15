const mongodb = require("../mongodb.connection");
const connection = mongodb.connection;
const ObjectId = mongodb.ObjectId;

module.exports = {
  create: create,
  readAll: readAll,
  readById: readById,
  escrowIdMatchPeopleId: escrowIdMatchPeopleId,
  update: update
};

function create(body) {
  return connection
    .db()
    .collection("infoStatements")
    .insert(body)
    .then(statement => statement.insertedIds[0].toString());
}

function readAll(tenantId) {
  return connection
    .db()
    .collection("infoStatements")
    .find({ tenantId: tenantId })
    .toArray()
    .then(statements => {
      if (statements) {
        return statements.map(item => {
          item._id = item._id.toString();
          return item;
        });
      }
      return null;
    });
}
function readById(id) {
  return connection
    .db()
    .collection("infoStatements")
    .findOne({ personId: id }) //_id: new ObjectId(id) if you wanted to find object Id
    .then(soi => {
      console.log(soi);
      if (soi) {
        soi._id = soi._id.toString();
        return soi;
      }
    });
}
function readByEscrowId(id) {
  return connection
    .db()
    .collection("infoStatements")
    .find({ escrowId: id }) //_id: new ObjectId(id) if you wanted to find object Id
    .then(soi => {
      console.log(soi);
      if (soi) {
        soi._id = soi._id.toString();
        return soi;
      }
    });
}
function update(soi) {
  const id = new ObjectId(soi.id);
  delete soi.id; //this makes it so that mongo will not insert an erroneous id property

  return connection
    .db()
    .collection("infoStatements")
    .updateOne({ _id: id }, { $set: soi })
    .then(result => Promise.resolve());
}

function escrowIdMatchPeopleId(escrowId) {
  return connection
    .db()
    .collection("infoStatements")
    .aggregate([
      {
        $match: {
          $or: [{ escrowId: ObjectId(escrowId) }, { escrowId: escrowId }]
        }
      }
      // {
      //   $lookup: {
      //     from: "people",
      //     localField: "personId",
      //     foreignField: "_id",
      //     as: "person"
      //   }
      // },
      // {
      //   $match: {
      //     personId: ObjectId("5ade915bf774b23f4050c031")
      //   }
      // },
      // { $unwind: "$person" }
      // { $match: { escrowId: escrowId } },
      // { $unwind: { path: "$people", preserveNullAndEmptyArrays: true } },
      // {
      //   $lookup: {
      //     from: "infoStatements",
      //     localField: "people.person._id",
      //     foreignField: "personId",
      //     as: "SoI"
      //   }
      // },
      // { $unwind: { path: "$SoI", preserveNullAndEmptyArrays: true } },
      // { $match: { "SoI.escrowId": escrowId } },
      // {
      //   $project: {
      //     _id: 1,
      //     status: {
      //       $switch: {
      //         branches: [
      //           {
      //             case: { $eq: ["$SoI.finalSave", true] },
      //             then: "Completed"
      //           },
      //           {
      //             case: { $eq: ["$SoI.finalSave", false] },
      //             then: "In Progress"
      //           }
      //         ],
      //         default: "Not Started"
      //       }
      //     },
      //     soi: "$SoI",
      //     name: {
      //       $concat: [
      //         "$people.person.firstName",
      //         " ",
      //         "$people.person.lastName"
      //       ]
      //     }
      //   }
      // }
    ])
    .toArray()
    .then(response => {
      for (let i = 0; i < response.length; i++) {
        let soi = response[i];
        soi._id = soi._id.toString();
      }
      return response;
    });
}
