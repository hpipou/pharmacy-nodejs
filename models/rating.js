'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rating.belongsTo(models.User,{foreignKey:{name:'idUser'}})
      Rating.belongsTo(models.Profil,{foreignKey:{name:'idProfil'}})
      Rating.belongsTo(models.Product,{foreignKey:{name:'idProduct'}})
    }
  }
  Rating.init({
    rating_note: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    idProfil: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};