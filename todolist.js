
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
let ent = require('entities');
const bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/* S'il n'y a pas de todolist dans la session, on en créé une vide dans un array */
app.use(function(req, res, next){
    if (typeof(req.socket.todolist) == 'undefined'){
        req.socket.todolist = [];
    }
    next();
})

/* On affiche la todolist et le formulaire */
    .get('/todo', function(req, res){
        res.render('todo.ejs', {todolist: req.socket.todolist});
    })

/* On ajoute un élément à la todolist */
    .post('/todo/ajouter/', urlencodedParser, function (req, res) {
        if(req.body.newtodo !== ''){
            req.socket.todolist.push(req.body.newtodo);
        }
        res.redirect('/todo')
    })

/* Supprimer un élément de la todolist */
    .get('/todo/supprimer/:id', function (req, res) {
        if(req.params.id !== ''){
            req.socket.todolist.splice(req.params.id, 1);
        }
        res.redirect('/todo')
    })

/* On redirige sur la todolist si la page n'est pas trouvée */
    .use(function (req, res) {
        res.redirect('/todo')
    });

    /* Dès qu'on reçoit un message, on récupère son contenu et on le transfère aux autres personnes */
io.sockets.on('message', function(message){
    message = ent.encode(message);
    socket.emit('message', {message: message});
});

server.listen(8080);
