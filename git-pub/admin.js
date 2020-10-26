axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

$(function () {
    $("#boutonAnnonce").click(function chargerAnnonce() {


        $(".utilisateurs").remove()
        $(".annonce").remove()
        $(".grosseDescription").remove()

        axios.get(`/annoncesRecruteur`)
            .then(function (res) {
                let iD = [];
                let t = [];
                let en = [];
                let p = [];
                let l = [];
                let tC = [];
                let pD = [];
                let gD = [];
                for (i = [0]; i < res.data.length; i++) {
                    iD.push(res.data[i].idannonces);
                    const titre = res.data[i].titre;
                    t.push(res.data[i].titre);
                    const entreprise = res.data[i].entreprise;
                    en.push(res.data[i].entreprise);
                    const poste = res.data[i].poste;
                    p.push(res.data[i].poste);
                    const localisation = res.data[i].ville;
                    l.push(res.data[i].ville);
                    const typeContrat = res.data[i].typecontrat;
                    tC.push(res.data[i].typecontrat);
                    const petiteDescription = res.data[i].descriptionbreve;
                    pD.push(res.data[i].descriptionbreve);
                    const grosseDescription = res.data[i].grossedescription;
                    gD.push(res.data[i].grossedescription);



                    $("#rMenuAnnonce").append(
                        "<div class='annonce' id='annonce" + i + "'>" +
                        "<div>" +
                        "<h2 id='t-" + i + "'>" + titre + "</h2>" +
                        "<div id='p-" + i + "'>" + poste + "</div>" +
                        "<div id='e-" + i + "'>" + entreprise + "</div>" +
                        "<div id='l-" + i + "'>" + localisation + "</div>" +
                        "<div>" + typeContrat + "</div>" +
                        "<p id='pd-" + i + "'>" + petiteDescription + "</p>" +
                        "<button class='learnMore' id='GD-" + i + "'>learn more</button>" +
                        "<button class='modifier' id='m-" + i + "'>modifier</button>" +
                        "<button class='supprimer' id='s-" + i + "'>supprimer</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>")
                    $("#rMenuAnnonce").append(
                        "<p class='grosseDescription' id='grosseDescription" + i + "'>" + grosseDescription + "</p>"
                    )
                }
                $(function () {
                    $(".grosseDescription").hide();
                    $(".learnMore").click(function () {
                        let id = $(this).attr('id')
                        $(".grosseDescription").hide(),
                            $('#grosseDescription' + (id.split('-')[1]) + '').show();

                    });
                });

                $(".supprimer").click(function (e) {
                    e.preventDefault();

                    let id = $(this).attr('id')
                    const position = id.split('-')[1] + ''
                    const ID = iD[position]


                    axios.post(`/supprimerannonce`, { ID })
                        .then(function (res) {
                            chargerAnnonce(e)
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                });

                $(".modifier").click(function (e) {
                    e.preventDefault();
                    let id = $(this).attr('id')
                    const position = id.split('-')[1] + ''
                    const ID = iD[position]
                    console.log(position)
                    console.log(ID)

                    $("#modifier").remove()
                    $("#annonce" + position + "").append(
                        "<div id='modifier'>" +
                        "<a href='recruteur.html' id='annulerForm'>" +
                        "<button>annuler</button>" +
                        "</a>" +
                        "<form action='' id='mForm'>" +
                        "<container class='form1'>" +
                        "<label for='mTitre'>Titre: </label>" +
                        "<input type='text' name='mTitre' id='mTitre' value=" + t[position] + " required>" +
                        "<label for='mPoste'>Poste: </label>" +
                        "<input type='text' id='mPoste' value=" + p[position] + " required>" +
                        "<label for='mEntreprise'>Entreprise: </label>" +
                        "<input type='text' name='mEntreprise' id='mEntreprise' value=" + en[position] + " required>" +
                        "<label for='mLocalisation'>Ville: </label>" +
                        "<input type='text' id='mLocalisation' value=" + l[position] + " required>" +
                        "<label for='mTypeContrat'>Type de contrat: (CDD resélectionné par default)</label>" +
                        "<select name='mTypeContrat' id='mTypeContrat' value=" + tC[position] + ">" +
                        "<option value='CDD'>CDD</option>" +
                        "<option value='CDI'>CDI</option>" +
                        "</select>" +
                        "<label for='mPetiteDescription'>Description brève: </label>" +
                        "<textarea name='mPetiteDescription' id='mPetiteDescription' cols='30' rows='5' maxlength='60' required>" + pD[position] + "</textarea>" +
                        "</container>" +
                        "<container class='form2'>" +
                        "<label for='mGrosseDescription'>Description détaillée: </label>" +
                        "<textarea name='mGrosseDescription' id='mGrosseDescription' cols='30' rows='15'>" + gD[position] + "</textarea>" +
                        "<button id='applyModif'>Sauvegarder les modifications</button>" +
                        "</container>" +
                        "</form>" +
                        "</div>")

                    $("#applyModif").click(function (e) {
                        e.preventDefault()

                        let titreModifier = $("#mTitre")[0].value;
                        let posteModifier = $("#mPoste")[0].value;
                        let entrepriseModifier = $("#mEntreprise")[0].value;
                        let localisationModifier = $("#mLocalisation")[0].value;
                        let typeContratModifier = $("#mTypeContrat")[0].value;
                        let petiteDescriptionModifier = $("#mPetiteDescription")[0].value;
                        let grosseDescriptionModifier = $("#mGrosseDescription")[0].value;


                        axios.post(`/modifierannonce`, { ID, titreModifier, posteModifier, entrepriseModifier, localisationModifier, typeContratModifier, petiteDescriptionModifier, grosseDescriptionModifier })
                            .then(function (res) {
                                console.log(res)
                                chargerAnnonce(e)
                            })
                            .catch(function (error) {
                                console.log(error);
                            });

                    })

                });
            })
            .catch(function (error) {
                console.log(error);
            });
    })
})

$(function () {
    $("#boutonUtilisateur").click(function chargerUtilisateurs() {


        $(".utilisateurs").remove()
        $(".annonce").remove()
        $(".grosseDescription").remove()

        axios.get(`/utilisateur`)
            .then(function (res) {
                let iD = [];
                let n = [];
                let p = [];
                let ne = [];
                let em = [];
                for (i = [0]; i < res.data.length; i++) {
                    iD.push(res.data[i].ididentifiants);
                    const nom = res.data[i].nom;
                    n.push(res.data[i].nom);
                    const prenom = res.data[i].prenom;
                    p.push(res.data[i].prenom);
                    const nomEntreprise = res.data[i].nomEntreprise;
                    ne.push(res.data[i].nomEntreprise);
                    const email = res.data[i].email;
                    em.push(res.data[i].email);



                    $("#rMenuAnnonce").append(
                        "<div class='utilisateurs' id='user" + i + "'>" +
                        "<div id='t-" + i + "'>" + nom + "</div>" +
                        "<div id='p-" + i + "'>" + prenom + "</div>" +
                        "<div id='e-" + i + "'>" + nomEntreprise + "</div>" +
                        "<div id='l-" + i + "'>" + email + "</div>" +
                        "<button class='modifier' id='m-" + i + "'>modifier</button>" +
                        "<button class='supprimer' id='s-" + i + "'>supprimer</button>" +
                        "<br>" +
                        "</div>")

                }

                $(".supprimer").click(function (e) {
                    e.preventDefault();

                    let id = $(this).attr('id')
                    const position = id.split('-')[1] + ''
                    const ID = iD[position]


                    axios.post(`/supprimeruser`, { ID })
                        .then(function (res) {
                            chargerUtilisateurs(e)
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                });

                $(".modifier").click(function (e) {
                    e.preventDefault();
                    let id = $(this).attr('id')
                    const position = id.split('-')[1] + ''
                    const ID = iD[position]


                    $("#modifier").remove()
                    $("#user" + position + "").append(
                        "<div id='modifier'>" +
                        "<a href='administrateur.html' id='annulerForm'>" +
                        "<button>annuler</button>" +
                        "</a>" +
                        "<form action='' id='mForm'>" +
                        "<container class='form1'>" +
                        "<label for='mNom'>Nom: </label>" +
                        "<input type='text' name='mNom' id='mNom' value=" + n[position] + " required>" +
                        "<label for='mprenom'>Prenom: </label>" +
                        "<input type='text' id='mprenom' value=" + p[position] + " required>" +
                        "<label for='mnomEntreprise'>Nom entreprise: </label>" +
                        "<input type='text' name='mnomEntreprise' id='mnomEntreprise' value=" + ne[position] + " required>" +
                        "<label for='memail'>Email: </label>" +
                        "<input type='text' id='memail' value=" + em[position] + " required>" +
                        "<button id='applyModif'>Sauvegarder les modifications</button>" +
                        "</container>" +
                        "</form>" +
                        "</div>")

                    $("#applyModif").click(function (e) {
                        e.preventDefault()

                        let nomModifier = $("#mNom")[0].value;
                        let prenomModifier = $("#mprenom")[0].value;
                        let nomEntrepriseModifier = $("#mnomEntreprise")[0].value;
                        let emailModifier = $("#memail")[0].value;


                        axios.post(`/modifierUser`, { ID, nomModifier, prenomModifier, nomEntrepriseModifier, emailModifier })
                            .then(function (res) {
                                console.log(res)
                                chargerUtilisateurs(e)
                            })
                            .catch(function (error) {
                                console.log(error);
                            });

                    })

                });
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}) 