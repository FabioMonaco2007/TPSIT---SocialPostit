const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();

//Configurazione caricamento immagini
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); //Per rendere accessibili le immagini

//1. Form di creazione
app.get('/post', (req, res) => {
    res.render('post');
});

//2. Salvataggio Post con Immagine
app.post('/post', upload.single('immagine'), (req, res) => {
    const { titolo, descrizione, info_aggiuntive } = req.body;
    
    const nuovoPost = {
        id: Date.now(),
        titolo,
        descrizione,
        info_aggiuntive,
        immagine: req.file ? `/uploads/${req.file.filename}` : null
    };

    const data = JSON.parse(fs.readFileSync('post.json', 'utf8') || "[]");
    data.push(nuovoPost);
    fs.writeFileSync('post.json', JSON.stringify(data, null, 2));

    res.redirect('/gallery');
});

//3. Gallery (Anteprime)
app.get('/gallery', (req, res) => {
    const posts = JSON.parse(fs.readFileSync('post.json', 'utf8') || "[]");
    res.render('gallery', { posts });
});

//4. Dettaglio Post specifico
app.get('/post/:id', (req, res) => {
    const posts = JSON.parse(fs.readFileSync('post.json', 'utf8') || "[]");
    const post = posts.find(p => p.id == req.params.id);
    res.render('postDetail', { post });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));