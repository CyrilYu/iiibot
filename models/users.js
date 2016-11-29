
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
    image: {
      type: DataType.STRING
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
