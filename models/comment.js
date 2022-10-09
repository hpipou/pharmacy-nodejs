'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User,{foreignKey:{name:'idUser'}})
      Comment.belongsTo(models.Profil,{foreignKey:{name:'idProfil'}})
      Comment.belongsTo(models.Product,{foreignKey:{name:'idProduct'}})
    }
  }
  Comment.init({
    comment: DataTypes.STRING,
    idProduct: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    idProfil: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};