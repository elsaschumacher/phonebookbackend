const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");
require("dotenv").config();

const Person = require("./person");

morgan.token("data", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(morgan(":method :url :status :total-time ms :data "));
// POST /api/persons 200 61 - 4.896 ms {"name": "Liisa Marttinen", "number": "123"}

app.use(express.json());

app.use(express.static("build"));

app.use(cors());

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get(`/api/persons/:id`, (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete(`/api/persons/:id`, (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) =>
      response.status(400).json({
        error: error.message,
      })
    );
});

app.get("/info", (request, response) => {
  Person.count().then((count) => {
    response.send(`<div>Phonebook has info for ${count} people.
    <br></br>
    ${new Date()}
    </div>`);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
