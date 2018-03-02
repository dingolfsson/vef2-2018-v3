const express = require('express');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./notes');

const router = express.Router();

// Create
async function postRequest(req, res) {
  const { title = '', text = '', datetime = '' } = req.body;
  const data = await create({ title, text, datetime });
  if (data.error === null) {
    return res.json(data.item);
  }
  return res.json(data.error);
}

// Get All Notes
async function getAll(req, res) {
  const all = await readAll();
  res.json(all.rows);
}

// Get note by ID
async function getID(req, res) {
  const { id } = req.params;
  const getting = await readOne(id);
  if (getting.length === 1) {
    return res.json(getting);
  }
  return res.status(404).json({ error: 'Not found' });
}

// Update a note
async function put(req, res) {
  const { id } = req.params;
  const { title = '', text = '', datetime = '' } = req.body;

  const data = await update(id, { title, text, datetime });

  if (data.item != null) {
    return res.json(data.item);
  }
  return res.status(404).json({ error: 'Not found' });
}

// Delete a note
async function deleteID(req, res) {
  const { id } = req.params;
  const deleting = await del(id);
  if (deleting.item) {
    return res.json();
  }
  return res.status(404).json({ error: deleting.message });
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.post('/', catchErrors(postRequest));
router.get('/', catchErrors(getAll));
router.get('/:id', catchErrors(getID));
router.put('/:id', catchErrors(put));
router.delete('/:id', catchErrors(deleteID));
module.exports = router;
