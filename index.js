const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

  morgan.token('datalog', function (req, res) { 
   return JSON.stringify(req.body)
 })

app.use(morgan(':method :datalog :url :status :res[content-length] - :response-time ms'))
     

app.get('/', (req, res) => {
  res.send('<h1>Phone Book</h1>')
})

app.get('/info', (req, res) => {
    const time = new Date().toString()
    Person
    .find({})
    .then(result => {
      console.log('kannan koko: '+result.size)
      const respString = '<div><p>There are '+result.size+' contacts in phonebook.</p><p>'+time+'</p></div>'
      res.send(respString)
    })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
const person = Person
  .find({_id: request.params.id})
  .then(res => {
    response.json(res)
  })
  .catch(error => {
    response.status(404).end()
  })
})

app.get('/api/persons', (req, res) => {
  Person
  .find({})
  .then(result => res.json(result.map(Person.formatPerson)))
  .catch(error => {
    console.log(error)
    res.status(404).end()
  })
})
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body.content)
  
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({error: 'content missing'})
    }
    const person = new Person({
      name: body.name,
      number: body.number
    })

  //   Person
  //   .find({name: body.name})
  //   .then(result => {
  //   .save()
  //   .then(savedPerson => response.json(Person.formatPerson(person)))    
  //   .catch(error => {
  //     console.log(error)
  //     response.status(404).end()
  //   })
  // })

   person
   .save()
   .then(Person.formatPerson)
   .then(res => response.json(res))
   .catch(error => {
    console.log('error: name probably already in db! '+error)
    response.status(404).end()
    })
});

app.delete('/api/persons/:id', (request, response) => {
  Person
  .findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => {
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person
      .findByIdAndUpdate(request.params.id, person, { new: true } )
      .then(updatedPerson => {
        response.json(Person.formatPerson(updatedPerson))
      })
      .catch(error => {
        response.status(400).send({ error: 'could not find this person' })
      })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
