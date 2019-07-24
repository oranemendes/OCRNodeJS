var express = require('express');
var session = require('cookie-session'); // Charge le middleware des sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

/* On utilise les sessions */
app.use(session({secret: 'todotopsecret'}))

/* S'il n'y a pas de todolist dans la session, on en créé une vide dans un array */
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined'){
        req.session.todolist = [];
    }
    next();
})

/* On affiche la todolist et le formulaire */
    .get('/todo', function(req, res){
        res.render('todo.ejs', {todolist: req.session.todolist});
    })

/* On ajoute un élément à la todolist */
    .post('/todo/ajouter/', urlencodedParser, function (req, res) {
        if(req.body.newtodo !== ''){
            req.session.todolist.push(req.body.newtodo);
        }
        res.redirect('/todo')
    })

/* Supprimer un élément de la todolist */
    .get('/todo/supprimer/:id', function (req, res) {
        if(req.params.id !== ''){
            req.session.todolist.splice(req.params.id, 1);
        }
        res.redirect('/todo')
    })

/* On redirige sur la todolist si la page n'est pas trouvée */
    .use(function (req, res) {
        res.redirect('/todo')
    })

.listen(8080);
