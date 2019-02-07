const mongo = require('../mongo')
const { ObjectID } = require('mongodb')

module.exports = collectionName => {
  const getCol = () => mongo.db('blog').collection(collectionName)

  const objID = async id => {
    try {
      const objectId = new ObjectID(id)
      return objectId
    } catch (err) {
      throw new Error('Invalid id')
    }
  }

  function findAll(query = {}) {
    return getCol()
      .find(query)
      .toArray()
  }

  async function findById(id) {
    const oid = await objID(id)
    return getCol().findOne({ _id: oid })
  }

  function create(data) {
    const newDoc = {
      ...data,
      createdAt: new Date()
    }

    return getCol()
      .insertOne(newDoc)
      .then(res => {
        return res.ops[0]
      })
  }

  async function update(existingDoc, changes) {
    const updatedDoc = {
      ...existingDoc,
      ...changes
    }
    const oid = await objID(existingDoc._id)
    return getCol()
      .updateOne(
        {
          _id: oid
        },
        { $set: updatedDoc }
      )
      .then(() => findById(existingDoc._id))
  }

  function remove(id) {
    return getCol().deleteOne({ _id: id })
  }

  return {
    findAll,
    findById,
    create,
    update,
    remove
  }
}
