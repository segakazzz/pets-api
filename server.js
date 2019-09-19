var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var owners = [
  {
    id: 1,
    name: 'Adam',
    pets: [
      {
        id: 1,
        name: 'Vera',
        type: 'Dog'
      },
      {
        id: 2,
        name: 'Felix',
        type: 'Cat'
      }
    ]
  },
  {
    id: 2,
    name: 'Kamilah',
    pets: [
      {
        id: 1,
        name: 'Doug',
        type: 'Dog'
      }
    ]
  }
]

// GET /api/owners
app.get('/api/owners', function (req, res, next) {
  res.json(owners)
})

// GET /api/owners/:id
app.get('/api/owners/:id', function (req, res, next) {
  const theOwner = owners.find(function (owner) {
    return String(owner.id) === req.params.id
  })
  if (theOwner) {
    res.json(theOwner)
  } else {
    res.status(404).send('')
    next()
  }
})

// POST /api/owners
app.post('/api/owners', function (req, res, next) {
  const newId = owners[owners.length - 1].id + 1
  owners.push(Object.assign({ id: newId }, req.body))
  res.send(String(newId))
  console.log(owners)
})

// PUT /api/owners/:id
app.put('/api/owners/:id', function (req, res, next) {
  const result = owners.some(function (owner, idx, original) {
    if (String(owner.id) === req.params.id) {
      owners[idx].isComplete = true
      return true
    }
  })
  if (result) {
    const theOwner = owners.find(function (owner, idx, original) {
      return String(owner.id) === req.params.id
    })
    res.json(theOwner)
  } else {
    res.status(404).send('error')
    next()
  }
})

// DELETE /api/owners/:id
app.delete('/api/owners/:id', function (req, res, next) {
  const result = owners.some(function (owner, idx, original) {
    if (String(owner.id) === req.params.id) {
      owners.splice(idx, 1)
      return true
    }
  })
  if (result) {
    res.send('ID: ' + req.params.id + ' was deleted successfully')
    console.log(owners)
  } else {
    res.sendStatus(404)
    next()
  }
})

// GET /api/owners/:id/pets

// GET /api/owners/:id/pets/:petId

// POST /api/owners/:id/pets

// PUT /api/owners/:id/pets/:petId

// DELETE /api/owners/:id/pets/:petId

app.listen(3000, function () {
  console.log('Pets API is now listening on port 3000...')
})
