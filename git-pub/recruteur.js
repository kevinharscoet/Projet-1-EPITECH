axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

let session = "inactive"
        const sessionActive = document.cookie;
        if(sessionActive != ""){
            session = "active"
        }else if(sessionActive===""){
            session ="inactive",
            location.href = "main.html"
        }
        console.log(session)
        $("#decon").click(function(){
            document.cookie = 'useId' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;'
            localStorage.clear();
        })



$(function(){
    $("#recruteurForm").submit(function(e){
        // e.preventDefault();
            
            let titre = $("#rTitre")[0].value
            let entreprise = $("#rEntreprise")[0].value
            let poste = $("#rPoste")[0].value
            let ville = $("#rLocalisation")[0].value
            let typeContrat = $("#rTypeContrat")[0].value
            let descriptionBreve = $("#rPetiteDescription")[0].value
            let grosseDescription = $("#rGrosseDescription")[0].value
            let idEntreprise = 1234567890 //TODO: Recupérer le vrai id grace a l'entreprise du user
            
            
            
            axios.post('/', { titre, entreprise, poste, ville, typeContrat, descriptionBreve, grosseDescription, idEntreprise }
            )
            .then(function (res) {
                console.log(res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        });

})

$(function()
{
    $("#vosAnnonces").click(function chargerAnnonce(e)
    {
        e.preventDefault();
            
        
            $(".annonce").remove()
            $(".grosseDescription").remove()
            
            axios.get(`/annoncesRecruteur` )
            .then(function (res) 
            {
                let iD = [];
                let t = [];
                let en = [];
                let p = [];
                let l = [];
                let tC = [];
                let pD = [];
                let gD = [];
                for(i = [0]; i < res.data.length; i++)
                {
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
                    "<div class='annonce' id='annonce"+i+"'>"+
                        "<div>"+
                            "<h2 id='t-"+i+"'>"+titre+"</h2>"+
                            "<div id='p-"+i+"'>"+poste+"</div>"+
                            "<div id='e-"+i+"'>"+entreprise+"</div>"+
                            "<div id='l-"+i+"'>"+localisation+"</div>"+
                            "<div>"+typeContrat+"</div>"+
                            "<p id='pd-"+i+"'>"+petiteDescription+"</p>"+
                            "<button class='learnMore' id='GD-"+i+"'>learn more</button>"+
                            "<button class='modifier' id='m-"+i+"'>modifier</button>"+
                            "<button class='supprimer' id='s-"+i+"'>supprimer</button>"+
                        "</div>"+
                    "</div>"+
                    "</div>")
                $("#rMenuAnnonce").append(
                    "<p class='grosseDescription' id='grosseDescription"+i+"'>"+grosseDescription+"</p>"
                    )
            }  
            $(function() 
            {
                $(".grosseDescription").hide();
                $(".learnMore").click(function () 
                {
                    let id = $(this).attr('id')
                    $(".grosseDescription").hide(),
                    $('#grosseDescription'+(id.split('-')[1])+'').show();
                    
                });
            });
            
            $(".supprimer").click(function(e){
                e.preventDefault();
                
                let id = $(this).attr('id')
                const position = id.split('-')[1]+''
                const ID = iD[position]
                
                
                axios.post(`/supprimerannonce`, { ID } )
                .then(function (res) {
                    chargerAnnonce(e)
                })
                .catch(function (error) {
                    console.log(error);
                });
                
            });
            
            $(".modifier").click(function(e){
                e.preventDefault();
                let id = $(this).attr('id')
                const position = id.split('-')[1]+''
                const ID = iD[position]
                console.log(position)
                console.log(ID)
                
                $("#modifier").remove()
                $("#annonce"+position+"").append(
                    "<div id='modifier'>"+
                        "<a href='recruteur.html' id='annulerForm'>"+
                            "<button>annuler</button>"+
                        "</a>"+
                        "<form action='' id='mForm'>"+
                            "<container class='form1'>"+
                                "<label for='mTitre'>Titre: </label>"+
                                "<input type='text' name='mTitre' id='mTitre' value="+t[position]+" required>"+
                                "<label for='mPoste'>Poste: </label>"+
                                "<input type='text' id='mPoste' value="+p[position]+" required>"+
                                "<label for='mEntreprise'>Entreprise: </label>"+
                                "<input type='text' name='mEntreprise' id='mEntreprise' value="+en[position]+" required>"+
                                "<label for='mLocalisation'>Ville: </label>"+
                                "<input type='text' id='mLocalisation' value="+l[position]+" required>"+
                                "<label for='mTypeContrat'>Type de contrat: (CDD resélectionné par default)</label>"+
                                "<select name='mTypeContrat' id='mTypeContrat' value="+tC[position]+">"+
                                    "<option value='CDD'>CDD</option>"+
                                    "<option value='CDI'>CDI</option>"+
                                "</select>"+
                                "<label for='mPetiteDescription'>Description brève: </label>"+
                                "<textarea name='mPetiteDescription' id='mPetiteDescription' cols='30' rows='5' maxlength='60' required>"+pD[position]+"</textarea>"+
                            "</container>"+
                            "<container class='form2'>"+
                                "<label for='mGrosseDescription'>Description détaillée: </label>"+
                                "<textarea name='mGrosseDescription' id='mGrosseDescription' cols='30' rows='15'>"+gD[position]+"</textarea>"+
                                "<button id='applyModif'>Sauvegarder les modifications</button>"+
                            "</container>"+
                        "</form>"+
                    "</div>")
                
                    $("#applyModif").click(function(e){
                        e.preventDefault()
                    
                        let titreModifier = $("#mTitre")[0].value;
                        let posteModifier = $("#mPoste")[0].value;
                        let entrepriseModifier = $("#mEntreprise")[0].value;
                        let localisationModifier = $("#mLocalisation")[0].value;
                        let typeContratModifier = $("#mTypeContrat")[0].value;
                        let petiteDescriptionModifier = $("#mPetiteDescription")[0].value;
                        let grosseDescriptionModifier = $("#mGrosseDescription")[0].value;
                        
                            
                            axios.post(`/modifierannonce`, { ID, titreModifier, posteModifier, entrepriseModifier, localisationModifier, typeContratModifier, petiteDescriptionModifier, grosseDescriptionModifier } )
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
        .catch(function (error) 
        {
            console.log(error);
        });
    })
}) 

