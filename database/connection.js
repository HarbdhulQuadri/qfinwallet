require('dotenv').config();

const { MongoClient } = require('mongodb');

const Database = process.env.dbName;
const url = process.env.mongoDbURl;
let dbClientConnection;

// Connects server to the database
const serverConnection = async () => {
  try {
    const client = await MongoClient.connect(url); // Connect without deprecated options
    dbClientConnection = client.db(Database); // Assigns dbClientConnection
    return { success: true, message: 'Connected to database ' + Database };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Other functions remain the same
const aggregateData = async (collections, object) => {
  try {
    const result = await dbClientConnection
      .collection(collections)
      .aggregate(object)
      .toArray();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// gets documents from collection that matches such query and selects only needed keys
const findAndSelectData = async (collections, query, select) => {
  try {
    const result = await dbClientConnection
      .collection(collections)
      .find(query, select)
      .toArray();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};



const findAndUpdateData = async (collections, query, select) => {
  // returns a promise
  try {
    const result = await dbClientConnection
      .collection(collections)
      .findOneAndUpdate(query, select);
    console.log(result);
    // returns an object with data:result (array) || message:error.getMessage
    return { success: true, data: result };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

// updates documents that match such query
const updateData = async (collections, query, update, upsert) => {
  // returns a promise
  try {
    const result = await dbClientConnection
      .collection(collections)
      .updateOne(query, update, upsert);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
    // returns an object with message:updated successfully || message:error.getMessage
    return { success: true, message: 'updated successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
// updates documents that match such query
const updateMany = async (collections, query, update, upsert) => {
  // returns a promise
  try {
    const result = await dbClientConnection
      .collection(collections)
      .updateMany(query, update, upsert);
    // returns an object with message:updated successfully || message:error.getMessage
    return { success: true, message: 'updated successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// deletes the document in the collection that matches the object
const deleteData = async (collections, object) => {
  // returns a promise
  try {
    await dbClientConnection.collection(collections).deleteOne(object);
    // returns an object with message:deleted successfully || message:error.getMessage
    return { success: true, message: 'deleted successfully' };
  } catch (error) {
    // console.log(error);
    return { success: false, message: error.message };
  }
};

// deletes the document in the collection that matches the object returns document
const findAndDeleteData = async (collections, filter, options) => {
  // returns a promise
  try {
    const result = await dbClientConnection
      .collection(collections)
      .findOneAndDelete(filter, options);
    // returns an object with data:result(array) || message:error.getMessage
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// inserts the document as per object into the collection
const insectOneData = async (collections, object) => {
  // return a promise
  try {
    const result = await dbClientConnection
      .collection(collections)
      .insertOne(object);
    // returns an object with message:inserted successfully || message:error.getMessage
    return { success: true, message: 'inserted successfully' };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

// // inserts the document as per object into the collection
// const insertData = async (collections, object) => {
//   // return a promise
//   try {
//     const result = await dbClientConnection
//       .collection(collections)
//       .insert(object);
//     // returns an object with message:inserted successfully || message:error.getMessage
//     return { success: true, message: 'inserted successfully', ...result };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };
const insertData = async (collections, object) => {
  try {
    const result = await dbClientConnection.collection(collections).insertOne(object);
    return { success: true, message: 'Inserted successfully', insertedId: result.insertedId };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


// inserts the document as per object into the collection
const insertMany = async (collections, array) => {
  // return a promise
  try {
    const result = await dbClientConnection
      .collection(collections)
      .insertMany(array);
    // returns an object with message:inserted successfully || message:error.getMessage
    return { success: true, message: 'inserted successfully', ...result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// finds the document that matches query in collections
const findData = async (collections, query) => {
  // return a promise
  try {
    const result = await dbClientConnection
      .collection(collections)
      .find(query)
      .toArray();
    // returns an object with data:result(array) || message:error.getMessage
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// counts the documents that match query in the collection
const countAllData = async (collections, query) => {
  // returns a promise
  // returns a promise

  try {
    const result = await dbClientConnection
      .collection(collections)
      .find(query)
      .count();
    // returns an object with data:result (number) || message:error.getMessage
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  serverConnection,
  findAndSelectData,
  findData,
  updateData,
  deleteData,
  countAllData,
  insertData,
  aggregateData,
  insectOneData,
  findAndDeleteData,
  insertMany,
  updateMany,
  findAndUpdateData,
};
