const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  created_at: createdAt,   // alias snake_case → camelCase
  updated_at: updatedAt,   // alias snake_case → camelCase
}) => ({
  id,
  title,
  body,
  tags,
  createdAt,
  updatedAt,
});

module.exports = { mapDBToModel };