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
router.post('/', async (req, res) => {
  const { title = '', text = '', datetime = '' } = req.body;
  const data = await create({ title, text, datetime });
  if (data) {
    return res.json({ title, text, datetime });
  }
  return res.json(data);
});

// Read all
router.get('/', async (req, res) => {
  const all = await readAll();
  res.json(all);
});

// Read One
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const getting = await readOne(id);
  if (getting.length === 1) {
    return res.json(getting);
  }

  return res.status(404).json({ error: 'Not found' });
});

// Update
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title = '' } = req.body;

  if (title.length === 0) {
    return res.status(400).json({
      field: 'title',
      error: 'Title must be a non-empty string',
    });
  }
  console.info(title);
  const item = await update(id, { title });
  console.info(item);

  if (item) {
    item.title = title;
    return res.status(200).json(item);
  }

  return res.status(404).json({ error: 'Not found' });
});

// Delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleting = await del(id);
  if (deleting.rowCount === 1) {
    return res.json();
  }

  return res.status(404).json({ error: 'Not found' });
});

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/* todo útfæra api */

module.exports = router;
