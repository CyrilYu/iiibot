
export default (sequelize, DataType) => {
  const News = sequelize.define('news', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    topic_id: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataType.STRING,
      allowNull: false
    },
    title: {
      type: DataType.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
    classMethods: {
      
    }
  })
  return News
}
