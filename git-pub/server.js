const cors = require("cors")

const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000


function dbconnect() {
  var mysql = require('mysql');

  console.log('Get connection ...');

  var conn = mysql.createConnection({
    database: 'mydb',
    host: "localhost",
    user: "root",
    password: "root"
  });

  conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
  return conn
}
const db = dbconnect()
app.use(cors())
app.use(express.json())


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

let server = app.listen(port, () => {
  console.log(`Je run sur le port : ${port}`)
})








app.post("/", (req, res) => {
  // const db = dbconnect()
  const titre = req.body.titre || ""
  const entreprise = req.body.entreprise || ""
  const poste = req.body.poste || ""
  const ville = req.body.ville || ""
  const typecontrat = req.body.typeContrat || ""
  const descriptionbreve = req.body.descriptionBreve || ""
  const grossedescription = req.body.grosseDescription || ""
  const identreprise = req.body.idEntreprise || 0

  db.query(`INSERT INTO annonces(titre,entreprise,poste,ville,typecontrat,descriptionbreve,grossedescription,entreprise_identreprise) VALUES ("${titre}", "${entreprise}", "${poste}", "${ville}", "${typecontrat}", "${descriptionbreve}", "${grossedescription}", ${identreprise})`, (err, result, field) => {

    if (err) throw err;

  })

  res.status(200).json("annonce ajoutée")
})


app.get("/user", (req, res, next) => {
  let poste = req.query.rPoste
  const ville = req.query.rVille
  const typeContrat = req.query.rTypeContrat

  // const db = dbconnect()
  db.query(`SELECT * FROM annonces;`, (err, result, field) => {
    if (err) throw err;
    res.status(200).json(result)
  })
})

app.get("/annoncesRecruteur", (req, res, next) => {


  // const db = dbconnect()
  db.query(`SELECT * FROM annonces;`, (err, result, field) => {
    if (err) throw err;
    res.status(200).json(result)
  })
});

app.post("/supprimerannonce", (req, res) => {

  let id = req.body.ID;
  console.log(id)

  // const db = dbconnect()
  db.query(`DELETE FROM annonces WHERE idannonces=` + id + ``, (err, result, field) => {
    if (err) throw err;
    res.status(200).json("result")
  })
});

app.post("/modifierannonce", (req, res) => {
  // const db = dbconnect()
  const Id = req.body.ID
  const mtitre = req.body.titreModifier || ""
  const mentreprise = req.body.entrepriseModifier || ""
  const mposte = req.body.posteModifier || ""
  const mville = req.body.localisationModifier || ""
  const mtypecontrat = req.body.typeContratModifier || ""
  const mdescriptionbreve = req.body.petiteDescriptionModifier || ""
  const mgrossedescription = req.body.grosseDescriptionModifier || ""


  db.query(`UPDATE annonces SET titre = "${mtitre}", entreprise = "${mentreprise}", poste = "${mposte}",ville = "${mville}", typecontrat = "${mtypecontrat}", descriptionbreve = "${mdescriptionbreve}", grossedescription = "${mgrossedescription}" WHERE idannonces = "${Id}"`, (err, result, field) => {
    if (err) throw err;


    res.status(200).json("annonce mise à jour")
  })
})

app.post("/postuler", (req, res) => {
  const nom = req.body.nom || ""
  const prenom = req.body.prenom || ""
  const email = req.body.email || ""
  let id = ""
  let idAnnonce = req.body.idAnnonce
  const message = req.body.message || ""
  console.log(idAnnonce)

  db.query(`INSERT INTO postulants (nom,prenom,email) VALUES ("${nom}", "${prenom}", "${email}")`, (err, result, field) => {

    if (err) throw err;
    id = result.insertId
    db.query(`INSERT INTO messages (message,emetteur,postulants_idpostulants) VALUES ("${message}", "${email}", "${id}")`, (err, result, field) => {

      if (err) throw err;
    })
    db.query(`INSERT INTO annonces_has_postulants (postulants_idpostulants,annonces_idannonces) VALUES ("${id}", "${idAnnonce}")`, (err, result, field) => {
      if (err) throw err;

      res.status(200).json("id postulant pour annonce ajouté")
    })

  })
})
app.post('/seconnecter', async (req, res) => {
  const email = req.body.email

  db.query(`SELECT * FROM identifiants WHERE email="${email}"`, async (err, result, field) => {
    try {
      if (err) throw { message: err }
      else {
        if (result.length < 1) {
          throw { message: "Cette utilisateur n'existe pas." },
          res.json(false)
        }
        else {
          const hashMdp = result[0].motDePasse
          const resultCompare = await bcrypt.compare(req.body.mdp, hashMdp)
          if (resultCompare === false) {
            throw { message: "Email ou mot de passe incorrect." },
            res.json(false)
          }
          else {
            // const privateKey = "peepeepoopoo"
            // jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
            //   console.log(token);
            // });

            res.status(200).json(result)

          }

        }
      }
    } catch (error) {
      console.log(error)
      res.json(error)
    }
  })
})

app.post('/seregister', async (req, res) => {
  const nom = req.body.nom
  const prenom = req.body.prenom
  const nomEntreprise = req.body.nomEntreprise
  const email = req.body.email
  const mdp = await bcrypt.hash(req.body.mdp, 10)


  db.query(`INSERT INTO identifiants (nom, prenom, nomEntreprise, email, motDePasse) VALUES ("${nom}", "${prenom}", "${nomEntreprise}", "${email}", "${mdp}")`, (err, result, field) => {
    if (err)

      res.status(400).json("already use")
    else {

      res.status(200).json("ok")
    }
  })
})

app.get("/utilisateur", (req, res, next) => {


  // const db = dbconnect()
  db.query(`SELECT * FROM identifiants;`, (err, result, field) => {
    if (err) throw err;
    res.status(200).json(result)
  })
});

app.post("/supprimeruser", (req, res) => {

  let id = req.body.ID;
  console.log(id)

  // const db = dbconnect()
  db.query(`DELETE FROM identifiants WHERE ididentifiants=` + id + ``, (err, result, field) => {
    if (err) throw err;
    res.status(200).json("result")
  })
});

app.post("/modifierUser", (req, res) => {
  // const db = dbconnect()
  const Id = req.body.ID
  const nom = req.body.nomModifier || ""
  const prenom = req.body.prenomModifier || ""
  const nomEntreprise = req.body.nomEntrepriseModifier || ""
  const email = req.body.emailModifier || ""


  db.query(`UPDATE identifiants SET nom = "${nom}", prenom = "${prenom}", nomEntreprise = "${nomEntreprise}",email = "${email}" WHERE ididentifiants = "${Id}"`, (err, result, field) => {
    if (err) throw err;


    res.status(200).json("annonce mise à jour")
  })
})