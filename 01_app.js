const express = require('express');
const fs = require('fs')
const app = express();
app.use(express.static('public'));


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


//////////////////////////////////////////////////////////////////   route:   html/01_form.htm
app.get('/html/01_form.htm', function (req, res) {
 console.log(__dirname);
 res.sendFile( __dirname + "/" + "01_form.htm" );
})
//////////////////////////////////////////////////////////////////   route:   /
app.get('/', (req, res) => {
 console.log('accueil')
 res.end('<h1>Accueil</h1>')
})
//////////////////////////////////////////////////////////////////   route:   /traiter_get
app.get('/traiter_get', function (req, res) {
 // Preparer l'output en format JSON

console.log('la route /traiter_get')

// on utilise l'objet req.query pour récupérer les données GET
 reponse = {
 prenom:req.query.prenom,
 nom:req.query.nom
 };

 let txtReponse = JSON.stringify(reponse)

 fs.appendFile(__dirname + '/public/data/membres.txt', ',' + txtReponse, function (err) {
  if (err) throw err;
  console.log('Sauvegardé');
});
console.log(reponse);
 res.end(JSON.stringify(reponse));
})

/////////////////////////////////////////////////////////////////  route : /membres

app.get('/membre', (req, res) => {
console.log('chemin = ' +  __dirname + '/public/data/membrs.txt' )
fs.readFile(__dirname + '/public/data/membres.txt', function (err, data) {
   if (err) return console.error(err);
   console.log(data.toString());
   // res.end(data.toString());   
   
    res.end(conversion_html(JSON.parse('[' + data + ']')));
});


})


var server = app.listen(8081, function () {
 var host = server.address().address
 var port = server.address().port
 
 console.log("Exemple l'application écoute sur http://%s:%s", host, port)

})