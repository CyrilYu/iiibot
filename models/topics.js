
export default (sequelize, DataType) => {
  const Topics = sequelize.define('topics', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    created_at: {
      type: DataType.DATE,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    timestamps: false,
    classMethods: {
      
    }
  })
  return Topics
}
