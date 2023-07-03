const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const name = process.argv[3];

const number = process.argv[4];

const url = `mongodb+srv://elsaschumacher:${password}@phonebook.asr9lva.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
  Person.find({}).then((people) => {
    console.log("Phonebook:");
    people.forEach((p) => {
      console.log(`${p.name} ${p.number}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
}

const person = new Person({
  name: name,
  number: number,
});

person.save().then((result) => {
  console.log(`Added ${name} number ${number} to the phonebook!`);
  mongoose.connection.close();
});
