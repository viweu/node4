const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const usersFilePath = path.join(__dirname, 'users.json');

app.use(express.json());

const loadUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    } catch (error) {
        return []; 
    }
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.get('/users', (req, res) => {
    const users = loadUsers();
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('Пользователь не найден');
    }
});

app.post('/users', (req, res) => {
    const users = loadUsers();
    const newUser  = {
        id: users.length ? users[users.length - 1].id + 1 : 1, 
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser );
    saveUsers(users);
    res.status(201).json(newUser );
});

app.put('/users/:id', (req, res) => {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        const updatedUser  = {
            ...users[userIndex],
            name: req.body.name,
            email: req.body.email
        };
        users[userIndex] = updatedUser ;
        saveUsers(users);
        res.json(updatedUser );
    } else {
        res.status(404).send('Пользователь не найден');
    }
});

app.delete('/users/:id', (req, res) => {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        saveUsers(users);
        res.send('Пользователь удален');
    } else {
        res.status(404).send('Пользователь не найден');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
