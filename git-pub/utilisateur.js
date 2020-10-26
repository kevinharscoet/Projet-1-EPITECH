


// $(function() {
//     $(".grosseDescription").hide();
//     $("#GD"+i).click(function () {
//         $(".grosseDescription").hide(),
//         $("#grosseDescription1").show();
//     });
// });

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

let session = "inactive"
const sessionActive = document.cookie;
if (sessionActive != "") {
    session = "active"
} else if (sessionActive === "") {
    session = "inactive",
        location.href = "main.html"
}
console.log(session)
$("#decon").click(function(){
    document.cookie = 'useId' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;'
    localStorage.clear();
})


// $(function () {
    $(document).ready(function (e) {
        // e.preventDefault();


        $(".annonce").remove()
        $(".grosseDescription").remove()

        // const rPoste = $("#poste")[0].value
        // const rVille = $("#ville")[0].value
        // const rTypeContrat = $("#typeContrat")[0].value


        axios.get(`/user`)
            .then(function (res) {
                for (i = [0]; i < res.data.length; i++) {
                    const idannonces = res.data[i].idannonces;
                    const titre = res.data[i].titre;
                    const entreprise = res.data[i].entreprise;
                    const poste = res.data[i].poste;
                    const localisation = res.data[i].ville;
                    const typeContrat = res.data[i].typecontrat;
                    const petiteDescription = res.data[i].descriptionbreve;
                    const grosseDescription = res.data[i].grossedescription;

                    $(".menuAnnonce").append("<div class='annonce id='"+idannonces+"''><div><h2>" + titre + "</h2><div>" + poste + "</div><div>" + entreprise + "</div><div>" + localisation + "</div><div>" + typeContrat + "</div><p>" + petiteDescription + "</p><button class='learnMore' id='GD-" + i + "'>learn more</button></div><a href='formuser.html' class='postuler'><button class='boutonPostuler' id='post-"+idannonces+"'>postuler</button></a></div>")
                    // console.log(entreprise, poste, localisation, typeContrat, petiteDescription, grosseDescription)
                    $(".menuDescription").append("<p class='grosseDescription' id='grosseDescription" + i + "'>" + grosseDescription + "</p>")
                    $(function () {
                        $(".grosseDescription").hide();
                        $(".learnMore").click(function () {
                            let id = $(this).attr('id')
                            $(".grosseDescription").hide(),
                                $('#grosseDescription' + (id.split('-')[1]) + '').show();
                        });
                        $(".boutonPostuler").click(function(){
                            let id = $(this).attr('id')
                            
                            localStorage.setItem("idannonce", ""+(id.split('-')[1])+''+"");
                        })
                    });
                }
                console.log(res.data);
                console.log(res.data.length)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });

    });

// })


$(function () {
    $("#sendForm").submit(function (e) {


        let nom = $("#nomForm")[0].value
        let prenom = $("#prenomForm")[0].value
        let email = $("#emailForm")[0].value

        let message = $("#contenu")[0].value
        let idAnnonce = localStorage.getItem("idannonce")


        
        axios.post('/postuler', { nom, prenom, email, message, idAnnonce }
        )
            .then(function (res) {
                console.log(res.data);
                location.href = "utilisateur.html";
            })
            .catch(function (error) {
                console.log(error);
            });
    });

})
