const Sequelize = require('sequelize')
const connection = require('../Database/database')
const Category = require('../categories/Category')

const Article = connection.define('artcles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})
//Realcionamento 1 para n: hasMany = Tem muitos
Category.hasMany(Article)
//Relacionamento 1 para 1: BelongsTo = Pertence a
Article.belongsTo(Category)

module.exports = Article