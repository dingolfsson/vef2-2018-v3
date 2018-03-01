/* todo sækja pakka sem vantar  */
require('dotenv').config();
const { Client } = require('pg');
const xss = require('xss');

const connectionString = 'postgres://:@localhost/v3';

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
async function create({ title = '', text = '', datetime = '' } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const data2 = await client.query('INSERT INTO notes(title, text, datetime) values ($1, $2, $3)', [xss(title), xss(text), xss(datetime)]);
    await client.end();
    return data2;
  } catch (err) {
    console.info(err);
  }
  return false;
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
    const data2 = await client.query('SELECT * FROM notes;');
    await client.end();
    return data2.rows;
  } catch (err) {
    console.info(err);
  }
  return false;
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not [found
 */
async function readOne(id) {
  /* todo útfæra */
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const data2 = await client.query('SELECT * FROM notes WHERE id = $1;', [id]);
    await client.end();
    return data2.rows;
  } catch (err) {
    console.info(err);
  }
  return false;
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
async function update(id, { title = '', text = '', datetime = '' } = {}) {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const data2 = await client.query('UPDATE notes SET title = $2 WHERE id = $1', [id, title]);
    await client.end();
    return data2;
  } catch (err) {
    console.info(err);
  }
  return false;
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(id) {
  /* todo útfæra */
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const data2 = await client.query('DELETE FROM notes WHERE id = $1', [id]);
    await client.end();
    return data2;
  } catch (err) {
    console.info(err);
  }
  return false;
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  del,
};
