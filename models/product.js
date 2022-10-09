'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User,{foreignKey:{name:'idUser'}})
      Product.belongsTo(models.Profil,{foreignKey:{name:'idProfil'}})
      Product.belongsTo(models.Category,{foreignKey:{name:'idCategory'}})
      Product.hasMany(models.Rating,{onDelete:"cascade"})
      Product.hasMany(models.Comment,{onDelete:"cascade"})
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    idProfil: DataTypes.INTEGER,
    idCategory: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};