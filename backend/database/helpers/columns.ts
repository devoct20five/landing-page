import { DataTypes } from 'sequelize';

/**
 * Standard UUID primary key, matching every Sequelize model in src/modules,
 * which all declare `id` as `DataType.UUID` with `defaultValue: DataType.UUIDV4`.
 */
export const uuidPk = {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: DataTypes.UUIDV4,
  allowNull: false,
};

export const uuidFk = (allowNull = false) => ({
  type: DataTypes.UUID,
  allowNull,
});

/**
 * created_at / updated_at pair for models with `timestamps: true`.
 * Sequelize models in this repo declare these as explicit non-null columns
 * (not relying on Sequelize's implicit timestamp defaults), so migrations
 * mirror that exactly.
 */
export const timestamps = () => ({
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/** created_at only, for `timestamps: false` models that still track creation time. */
export const createdAtOnly = () => ({
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
