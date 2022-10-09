'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profil.belongsTo(models.User,{foreignKey:{name:'idUser'}})
      Profil.hasMany(models.Product,{onDelete:"cascade"})
      Profil.hasMany(models.Rating,{onDelete:"cascade"})
      Profil.hasMany(models.Comment,{onDelete:"cascade"})
    }
  }
  Profil.init({
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    phone: DataTypes.STRING,
    adresse: DataTypes.STRING,
    country: DataTypes.STRING,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profil',
  });
  return Profil;
};