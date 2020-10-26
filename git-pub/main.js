axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
$(document).ready(function() {

let session = "inactive"
const sessionActive = document.cookie;
if(sessionActive != ""){
    session = "active"
}else if(sessionActive===""){
    session ="inactive"
}
console.log(session)
$(".body").ready(function(){
    if(session=="active"){
        $("#con").hide(),
        $("#enr").hide(),
        $("#decon").show(),
        $("#lienadmin").show()
    }else if(session=="inactive"){
        $("#decon").hide(),
        $("#con").show(),
        $("#enr").show(),
        $("#lienadmin").hide()
    }
})
$("#decon").click(function(){
    document.cookie = 'useId' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;'
    localStorage.clear();

})
$("#lienadmin").click(function(e){
    e.preventDefault();
    if(localStorage.getItem("admin")== "1"){
        location.href = "administrateur.html"
    }
    else{
        alert(" n'etes pas autorisé à aller sur la page administrateur!");
        console.log(location)
        location.href = "main.html"
    }
})


$("#textmain2").click(function (e) {
    e.preventDefault;
    if (session === "active") {
        if(localStorage.getItem("admin") == "1" || localStorage.getItem("recruteur") == "1")
        location.href = "recruteur.html";
        else {
            alert("vous n'etes pas recruteur")
            location.href = "main.html";
            
        }
    }
    else{
        location.href = "connexion.html";
    } 
})
$("#textmain1").click(function (e) {
    e.preventdefault;
    if (session === "active") {
        location.href = "utilisateur.html";
    }
    else {
        location.href = "connexion.html";
        
    }
})

$("#formConnexion").submit(function(e){
    e.preventDefault();
    const email = $("#cEmail")[0].value
    const mdp = $("#cMDP")[0].value
    axios.post('/seconnecter', { email, mdp })
    .then(function (res) {
        if (res.data == false) {
            alert("adresse mail ou mot de passe incorect")
            location.href = "register.html"
            
        }
        else {
            if(res.data[0].admin != undefined){
                document.cookie = "useId="+res.data[0].ididentifiants;
                localStorage.setItem("admin","1");
                location.href = "main.html";

            }else if(res.data[0].nomEntreprise != ""){
                document.cookie = "useId="+res.data[0].ididentifiants;
                localStorage.setItem("recruteur","1");
                location.href = "main.html";

            }else{
                document.cookie = "useId="+res.data[0].ididentifiants;
                location.href = "main.html";

            }
        }
    })
    .catch(function (error) {
        console.log(error);
    });
})
$("#formRegister").submit(function(e){
    e.preventDefault()
    
    const nom = $("#rNom")[0].value
    const prenom = $("#rPrenom")[0].value
    const nomEntreprise = $("#rNomEntreprise")[0].value
    const email = $("#rEmail")[0].value
    const mdp = $("#rMDP")[0].value
    axios.post('/seregister', { nom, prenom, nomEntreprise, email, mdp })
        .then(function (res) {
            console.log(res)
            if(res.data == "ok"){
                location.href = "connexion.html"
                // console.log("ok")
                
            }else{
                alert("Adresse mail déjà utilisée!") 
                
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        
})
});