const express = require('express');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//Rotta GET per visualizzare il form
app.get('/post', (req, res) => {
    res.render('post');
});

//Rotta POST per salvare i dati
app.post('/post', (req, res) => {
    const nuovoPost = req.body;
    
    //Leggi, aggiorna e scrivi sul file JSON
    const data = JSON.parse(fs.readFileSync('post.json', 'utf8') || "[]");
    data.push(nuovoPost);
    fs.writeFileSync('post.json', JSON.stringify(data, null, 2));
    
    res.send('Dati salvati con successo!');
});

app.listen(3000, () => console.log('Server running on port 3000'));