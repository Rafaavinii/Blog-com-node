const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const connection = require('./Database/database')

const categoriesController = require('./categories/CategoriesController')
const articleController = require('./articles/AticlesController')
const usersControllers = require('./users/usersController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

//View engine
app.set('view engine', 'ejs')

//sessions
app.use(session({
    secret: 'qualquercoisa',
    cookie: { maxAge: 3000000 }
}))

//Static
app.use(express.static('public'))

//Body parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Database
connection
    .authenticate()
    .then(() => {
        console.log('Connection success!')
    }).catch((error) => {
        console.log(error)
    })

//Controllers
app.use('/', categoriesController)
app.use('/', articleController)
app.use('/', usersControllers)

//Sessions Router
app.get('/session', (req, res) => {
    req.session.treinamento = 'formação njs'
    req.session.ano = 2019
    req.session.email = 'sdadas@ffas.com'
    req.session.user = {
        username: 'Rafa',
        email: 'email@gmail.com',
        id: 10
    }
    res.send('Sessão gerada!')
}) 

app.get('/read', (req, res) => {
    res.json({
        treinamento : req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user,
    })
})

//Router main
app.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories})
        })
    })
})

app.get('/:slug', (req, res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(articles => {
        if(articles !== undefined){
            Category.findAll().then(categories => {
                res.render('article', {articles: articles, categories: categories})
            })
        }else {
            res.redirect('/')
        }
    }).catch(err => {
        res.send(err)
    })
})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render('articlespcategories', {articles: category.articles, categories: categories})
            })

        }else{
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

app.listen(8080, () => {
    console.log('Running: port 8080')
})