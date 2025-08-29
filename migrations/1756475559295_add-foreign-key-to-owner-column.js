/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // create a new user
  pgm.sql(
    "INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes')"
  );

  // update the owner field in notes where the owner is NULL
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner IS NULL");

  // add a foreign key constraint on owner referencing the id column from users table
  pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop the foreign key constraint fk_notes.owner_users.id from notes table
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  // set the owner value back to NULL for notes where owner is old_notes
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");

  // delete the previously created user
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
