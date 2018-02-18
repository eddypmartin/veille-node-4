const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const util = require('util');

// Créer le parser « application/x-www-form-urlencoded » 
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
app.use(express.static('public'));

////////////////////////////////////////////////////  
function conversion_html(tableau)
{
  let noLigne = 0
  let chaine = '<table>'
  for (elm of tableau)
  {
    if (noLigne == 0)
    {
      noLigne++
      chaine += '<tr>'
      for (p in elm)
        {
          chaine += '<th>' + p + '</th>'    
        }
      chaine += '</tr>' 
    } 
  chaine += '<tr>'
    for (p in elm)
    {
      chaine += '<td>' + elm[p] + '</td>'     
    }
    chaine += '</tr>' 
  } 

  chaine += '</table>'
  return chaine
}


///////////////////////////////////////////////////////////// Route pour le formulaire GET 
app.get('/html/01_form_get.htm', function (req, res) {
 console.log(__dirname);
 res.sendFile( __dirname + "/" + "01_form_get.htm" );
})

///////////////////////////////////////////////////////////// Route pour le formulaire POST
app.get('/html/01_form_post.htm', function (req, res) {
 console.log(__dirname);
 res.sendFile( __dirname + "/" + "01_form_post.htm" );
})
/////////////////////////////////////////////////  Route pour l'accueil
app.get('/', (req, res) => {
 console.log('accueil')
 res.end('<h1>Accueil</h1>')
})
///////////////////////////////////////////////////////// Route pour le traitement du formulaire get
app.get('/traiter_get', function (req, res) {
 // Preparer l'output en format JSON

console.log('la route /traiter_get')

// on utilise l'objet req.query pour récupérer les données GET


fs.readFile(__dirname + '/public/data/membres.json', (err, data)=>{
  if(err)  return console.log(err)



  let dataJSON = JSON.parse(data)
  console.log('util.inspect(dataJSON) = ' + util.inspect(dataJSON));
  let reponse = {
   prenom:req.query.prenom,
   nom:req.query.nom,
   telephone : req.query.telephone,
   courriel : req.query.courriel
   };
  console.log('util.inspect(reponse) = ' + util.inspect(reponse)); 
  //console.log('util.inspect(dataJSON).push = ' + util.inspect(dataJSON.push(reponse)));
  dataJSON.push(reponse)
  let nouveauData = JSON.stringify(dataJSON)



  fs.writeFile(__dirname + '/public/data/membres.json', nouveauData, (err, resultat)=>{
    if (err) return cosole.log(err)
    console.log('fichier sauvegardé')
    res.end(JSON.stringify(reponse));

  })
})

 
})
///////////////////////////////////////////////////////// Route pour le traitement du formulaire post
app.post('/traiter_post', urlencodedParser, function (req, res) {
 // Preparer l'output en format JSON 
 reponse = {
 prenom:req.body.prenom,
 nom:req.body.nom,
 lamethode: "POST"
 };
 console.log('reponse');
 res.end(JSON.stringify(reponse));
})

/////////////////////////////////////////////////////////////////  route : /membres

app.get('/membre', (req, res) => {
console.log('chemin = ' +  __dirname + '/public/data/membres.json' )
fs.readFile(__dirname + '/public/data/membres.json', function (err, data) {
   if (err) return console.error(err);
   console.log(data.toString());
   // res.end(data.toString());   
   
    res.end(conversion_html(JSON.parse(data)));
    // res.end(conversion_html(JSON.parse('[' + data + ']')));
});

})


var server = app.listen(8081, function () {
 var host = server.address().address
 var port = server.address().port
 
 console.log("Exemple l'application écoute sur http://%s:%s", host, port)

})