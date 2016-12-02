
export default (sequelize, DataType) => {
  const Topics = sequelize.define('topics', {
    id: {
      type: DataType.STRING,
      primaryKey: true
    },
    name: {
      type: DataType.STRING,
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
  return Topics
}
