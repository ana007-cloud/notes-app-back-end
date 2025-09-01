/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // create collaborations table
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    note_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /*
    Add UNIQUE constraint on the combination of note_id and user_id.
    This prevents duplicate entries of the same note-user pair.
  */
  pgm.addConstraint('collaborations', 'unique_note_id_and_user_id', 'UNIQUE(note_id, user_id)');

  // add foreign key constraint on note_id referencing notes.id
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.note_id_notes.id',
    'FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE'
  );

  // add foreign key constraint on user_id referencing users.id
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop collaborations table
  pgm.dropTable('collaborations');
};
