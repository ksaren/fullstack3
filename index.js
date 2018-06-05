const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

  morgan.token('datalog', function (req, res) { 
   return JSON.stringify(req.body)
 })

app.use(morgan(':method :datalog :url :status :res[content-length] - :response-time ms'))

let persons = [
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 4
      }
    ]
  

app.get('/', (req, res) => {
  res.send('<h1>Phone Book</h1>')
})

app.get('/info', (req, res) => {
    const time = new Date().toString()
    const size = persons.length
    const respString = '<div><p>There are '+size+' contacts in phonebook.</p><p>'+time+'</p></div>'
    res.send(respString)
  })

app.get('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
const person = persons.find(p => p.id === id)
if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const generateId = () => {
    return Math.round(Math.random()*10000)
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body.content)
  
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({error: 'content missing'})
    }

   if (persons.some(p => p.name === body.name)){
       return response.status(400).json({error: 'name must be unique'})
   }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
