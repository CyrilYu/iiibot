
export default (sequelize, DataType) => {
  const News = sequelize.define('news', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    topic: {
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
    },
    image_url: {
      type: DataType.STRING
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
  return News
}
