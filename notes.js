require('dotenv').config();
const { Client } = require('pg');
const xss = require('xss');
const validator = require('validator');

const connectionString = 'postgres://:@localhost/v3';


/**
 * Validates title,text and datetime
 *
 * @param {Object} note - Note to validate
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Object} Object with errors if any.
 */
function validateText(note) {
  const errors = [];
  if (!validator.isLength(note.title, { min: 1, max: 255 })) {
    errors.push({ field: 'title', message: 'Title must be a string of length 1 to 255 characters' });
  }

  if (typeof note.text !== 'string') {
    errors.push({ field: 'text', message: 'Text must be a string' });
  }

  if (!validator.isISO8601(note.datetime)) {
    errors.push({ field: 'datetime', message: 'Datetime must be a ISO 8601 date' });
  }
  return errors;
}

/**
 * Create a note asynchronously.
 *
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create(note) {
  const client = new Client({ connectionString });
  const result = ({ error: '', item: '' });
  const index = 0;

  const validation = validateText(note);
  if (validation.length === 0) {
    try {
      await client.connect();
      const query = 'INSERT INTO notes (datetime, title, text) VALUES ($3, $1, $2) RETURNING *';
      const values = [xss(note.title), xss(note.text), xss(note.datetime)];
      const data = await client.query(query, values);
      await client.end();
      result.item = data.rows[index];
      result.error = null;
    } catch (err) {
      console.info(err);
    }
  } else {
    result.item = null;
    result.error = validation;
  }

  return result;
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const query = 'SELECT * FROM notes;';
    const data = await client.query(query);
    await client.end();
    return data;
  } catch (err) {
    console.info(err);
  }
  return null;
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not [found
 */
async function readOne(id) {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const query = 'SELECT * FROM notes WHERE id = $1;';
    const data = await client.query(query, [id]);
    await client.end();
    if (data.rowCount === 1) {
      return data.rows[0];
    }
  } catch (err) {
    console.info(err);
  }
  return null;
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, note) {
  const client = new Client({ connectionString });
  const result = ({ error: '', item: '' });
  const index = 0;

  const validation = validateText(note);
  if (validation.length === 0) {
    try {
      const updateQuery = 'UPDATE notes SET title = $2, text = $3, datetime = $4 WHERE id = $1';
      const query = 'SELECT * FROM notes WHERE id = $1';
      await client.connect();
      await client.query(updateQuery, [id, xss(note.title), xss(note.text), xss(note.datetime)]);
      const data = await client.query(query, [id]);
      await client.end();
      result.item = data.rows[index];
      result.error = null;
    } catch (err) {
      console.info(err);
    }
  } else {
    result.item = null;
    result.error = validation;
  }

  return result;
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  const client = new Client({ connectionString });
  const result = ({ message: '', item: true });
  try {
    const query = 'DELETE FROM notes WHERE id = $1';
    await client.connect();
    const data = await client.query(query, [id]);
    await client.end();
    if (data.rowCount === 1) {
      return result;
    }
  } catch (err) {
    console.info(err);
  }
  result.item = false;
  result.message = 'No note or ID.';
  return result;
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
