
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
      type: DataType.STRING,
      allowNull: true
    },
    schedule: {
      type: DataType.INTEGER,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE
    },
    created_at: {
      type: DataType.DATE
    }
  }, {
    timestamps: false,
    classMethods: {
      
    }
  })
  return Subscriptions
}
