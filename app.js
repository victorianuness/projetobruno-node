const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const sequelize = new Sequelize('tarefas_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false 
});


const Tarefa = sequelize.define('Tarefa', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  concluida: {
    type: DataTypes.STRING,
    allowNull: true
  },
  escolha:{
    type: DataTypes.STRING,
    allowNull: true
  
},
},
{ 
  timestamps: false 
});


sequelize.sync() 
  .then(() => {
    console.log('✅ MySQL conectado e Tabelas sincronizadas!');
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
  })
  .catch(err => {
    console.error('Erro ao conectar no MySQL:', err.message);
  });



app.get('/', (req, res) => res.send('API Fatec - MySQL Ativa'));


app.get('/tarefas', async (req, res) => {
  try {
    const lista = await Tarefa.findAll();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.post('/tarefas', async (req, res) => {
  try {
    const nova = await Tarefa.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});


app.put('/tarefas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Tarefa.update(req.body, { where: { id } });
    const atualizada = await Tarefa.findByPk(id);
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});


app.delete('/tarefas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Tarefa.destroy({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});