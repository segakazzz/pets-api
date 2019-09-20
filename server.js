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
app.get('/api/owners/:id/pets', function (req, res, next) {
  const theOwner = getOwnerById(req.params.id)
  if (theOwner) {
    res.send(theOwner.pets)
  } else {
    res.sendStatus(404)
    next()
  }
  console.log(theOwner)
})

// GET /api/owners/:id/pets/:petId
app.get('/api/owners/:id/pets/:petId', function (req, res, next) {
  const theOwner = getOwnerById(req.params.id)
  if (theOwner) {
    const thePet = getPetsById(theOwner.pets, req.params.petId)
    if (thePet) {
      res.json(thePet)
    } else {
      res.status(404).send('No pet found.')
      next()
    }
    // console.log(thePet)
  } else {
    res.status(404).send('No owner found.')
    next()
  }
})

// POST /api/owners/:id/pets
app.post('/api/owners/:id/pets', function (req, res, next) {
  const result = owners.some(function (owner, idx) {
    if (String(owner.id) === req.params.id) {
      const numPets = owner.pets.length
      const newPet = Object.assign(
        {
          id: owners[idx].pets[numPets - 1].id + 1
        },
        req.body
      )
      owners[idx].pets.push(newPet)
      return true
    }
  })
  if (result) {
    res.json(getOwnerById(req.params.id))
  } else {
    res.status(404).send('No owner found.')
    next()
  }
})

// PUT /api/owners/:id/pets/:petId
app.put('/api/owners/:id/pets/:petId', function (req, res, next) {
  const result = owners.some(function (owner, idx) {
    if (String(owner.id) === req.params.id) {
      const resultPet = owner.pets.some(function (pet, petIdx) {
        if (String(pet.id) === req.params.petId) {
          owner.pets[petIdx].isComplete = true
          return true
        }
      })
      if (resultPet) {
        res.json(owners[idx])
      } else {
        res.status(404).send('No pet found.')
      }
      return true
    }
  })
  if (!result) {
    res.status(404).send('No owner found.')
    next()
  }
})

// DELETE /api/owners/:id/pets/:petId
app.delete('/api/owners/:id/pets/:petId', function (req, res, next) {
  const theOwner = getOwnerById(req.params.id)
  if (theOwner) {
    const result = theOwner.pets.some(function(pet, idx){
      if (String(pet.id) === req.params.petId){
        theOwner.pets.splice(idx, 1)
        res.send(owners)
        return true
      }
    })
    if (!result){
      res.status(404).send('No pet found.')
    }
  } else {
    res.status(404).send('No owner found.')
  }
})

app.listen(3000, function () {
  console.log('Pets API is now listening on port 3000...')
})

function getOwnerById (id) {
  return owners.find(function (owner) {
    return id === String(owner.id)
  })
}

function getPetsById (petArray, petId) {
  return petArray.find(function (pet) {
    return String(pet.id) === petId
  })
}
