
export default (sequelize, DataType) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    },
    third_party_id: {
      type: DataType.STRING,
      allowNull: false
    },
    third_party_token: {
      type: DataType.STRING,
      allowNull: false
    },
    provider: {
      type: DataType.STRING,
      allowNull: false
    },
    platform: {
      type: DataType.STRING,
      allowNull: false
    },
    serial_num: {
      type: DataType.STRING,
      allowNull: false
    },
    auth_token: {
      type: DataType.STRING,
      allowNull: false
    },
    push_token: {
      type: DataType.STRING
    }
  }, {
    timestamps: false,
    classMethods: {
      
    }
  })
  return Users
}
