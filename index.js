const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("data", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(morgan(":method :url :status :total-time ms :data "));
// POST /api/persons 200 61 - 4.896 ms {"name": "Liisa Marttinen", "number": "123"}

app.use(express.json());

app.use(express.static("build"));

app.use(cors());

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get(`/api/persons/:id`, (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id == id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete(`/api/persons/:id`, (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (persons.map((p) => p.name).includes(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: Math.random(1000000),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  response.send(`<div>Phonebook has info for ${persons.length} people.
  <br></br>
  ${new Date()}
  </div>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
