import { DataTypes, QueryInterface } from 'sequelize';
import { uuidPk } from '../helpers/columns';

// Mirrors src/modules/clients/models/client-contact.model.ts.
//
// This is the tenancy join: a `users` row with user_type='client' becomes
// a real client-portal login only once it has a client_contacts row
// linking it to a `clients` company record. Per
// docs/00_CURRENT_STATE_AUDIT.md §3, the backend must resolve a client
// user's accessible clientId from *this table via the JWT user id* —
// never from a client-supplied clientId query param.
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('client_contacts', {
      id: uuidPk,
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'clients', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      designation: { type: DataTypes.STRING(100), allowNull: true },
      is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    // A given user should only be linked to a given client company once —
    // matches the model's own `indexes: [{ unique: true, fields: [...] }]`.
    await queryInterface.addIndex('client_contacts', ['client_id', 'user_id'], {
      unique: true,
      name: 'client_contacts_client_id_user_id_unique',
    });
    // Reverse lookup: "which client does this user belong to" — this is
    // the exact query the JWT-scoping fix in Phase 2 will run on every
    // authenticated client request, so it must be indexed, not scanned.
    await queryInterface.addIndex('client_contacts', ['user_id']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('client_contacts');
  },
};
