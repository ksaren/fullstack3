
const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = 'mongodb://demoUser:DEMOpassw0rd@ds247430.mlab.com:47430/fullstack_phonebook'


mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    index: {
        unique: true,
        dropDups: true
    }
},
  number: String
})

personSchema.statics.formatPerson = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person