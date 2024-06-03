const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const booksFilePath = 'books.json';

// Listagem dos livros
app.get('/books', (req, res) => {
    fs.readFile(booksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler o arquivo de livros.');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Compra de um livro
app.post('/books/purchase/:title', (req, res) => {
    const title = req.params.title;
    fs.readFile(booksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler o arquivo de livros.');
            return;
        }
        const books = JSON.parse(data);
        const bookIndex = books.findIndex(book => book.titulo === title);
        if (bookIndex === -1) {
            res.status(404).send('Livro não encontrado.');
            return;
        }
        if (books[bookIndex].quantidade <= 0) {
            res.status(400).send('Livro esgotado.');
            return;
        }
        books[bookIndex].quantidade--;
        fs.writeFile(booksFilePath, JSON.stringify(books), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao atualizar o arquivo de livros.');
                return;
            }
            res.send('Compra realizada com sucesso.');
        });
    });
});

// Cadastro de novos livros
app.post('/books', (req, res) => {
    const newBook = req.body;
    fs.readFile(booksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler o arquivo de livros.');
            return;
        }
        const books = JSON.parse(data);
        books.push(newBook);
        fs.writeFile(booksFilePath, JSON.stringify(books), 'utf8', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao atualizar o arquivo de livros.');
                return;
            }
            res.send('Livro cadastrado com sucesso.');
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
