'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profil,{onDelete:"cascade"})
      User.hasMany(models.Product,{onDelete:"cascade"})
      User.hasMany(models.Rating,{onDelete:"cascade"})
      User.hasMany(models.Comment,{onDelete:"cascade"})
    }
  }
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING,
    roleName: DataTypes.STRING,
    isProfil: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};