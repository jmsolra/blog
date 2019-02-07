const uuid = require('uuid');

const generateId = () => uuid.v4();

let data = [
  {
    id: generateId(),
    name: 'mi post',
    body: 'asasasas asasas',
    createAt: new Date(2019, 2, 1),
    tags: ['nodejs', 'uno', 'dos']
  }
];

function findAll() {
  return Promise.resolve(data);
}

function findById(id) {
  var post = data.find(item => item.id === id);
  return post ? Promise.resolve(post) : Promise.reject('not found');
}

function create(postData) {
  const newPost = {
    tags: [],
    ...postData,
    id: generateId(),
    createAt: new Date()
  };
  console.log(newPost);
  data.push(newPost);
  return Promise.resolve(newPost);
}

function update(postOld, postNew) {
  const newPost = {
    ...postOld,
    ...postNew
  };
  const index = data.findIndex(item => item.id === postOld.id);
  data[index] = newPost;
  return Promise.resolve(newPost);
}

function remove(id) {
  // const index = data.findIndex(item => item.id === id);
  // data.splice(index);
  data = data.filter(p => p.id !== id);
  return Promise.resolve(' Post delete');
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
