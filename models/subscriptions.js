
export default (sequelize, DataType) => {
  const Subscriptions = sequelize.define('subscriptions', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    topic: {
      type: DataType.STRING,
      allowNull: false
    },
    keyword: {
      type: DataType.STRING
    },
    schedule: {
      type: DataType.INTEGER,
      allowNull: false
    },
    serial_num: {
      type: DataType.STRING,
      allowNull: false
    },
    deleted_at: {
      type: DataType.DATE
    }
  }, {
    timestamps: false,
    classMethods: {
      
    }
  })
  return Subscriptions
}
