
// Recuperer les données du formulaire
function getForm(form) {
    const formData = new FormData(form);
    return {
        titre: formData.get("titre"),
        description: formData.get("description")
    };
}

// Ajouter une idee
async function addIdee(data) {
    const categorieOllama = await genericCategorie(data.titre,data.description);
    const {data: insertedData,error}= await supabaseClient
        .from("messages")
        .insert([
            {
                categorie: categorieOllama,
                    titre: data.titre,
                    description: data.description
            }
        ])
        .select()

        if(error){
            throw error;

            return insertedData
        }
}
//connection avec supabase
const supabaseUrl="https://uxqdhaetftpodexwdflj.supabase.co"
const supabaseKey ="sb_publishable_EbjQrsBevwc5Qb6OH-aSCA_Jk-RtHf2"
const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
)

async function loadMessages() {

    const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}
// Afficher les cartes
async function afficherCartes() {

    const message = await loadMessages();

    const cards = document.getElementById("card");
    const total = document.getElementById("Total_idee");

    cards.innerHTML = message.map((idee) => `
        <div class="bg-[#111a2e] border border-[#26324a] p-4 rounded-xl">

            <span class="text-orange-400 text-xs">
                ${idee.categorie?.toUpperCase()}
            </span>

            <h3 class="font-bold mt-2">
                ${idee.titre}
            </h3>

            <p class="text-gray-400 text-sm mt-1">
                ${idee.description}
            </p>

            <p class="text-gray-400 text-sm mt-1">
                ${idee.created_at ? new Date(idee.created_at).toLocaleDateString() : ""}
            </p>

            <button class="rounded-md px-2.5 py-1.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20"
             onclick="editIdee('${idee.id}')">
             <i class="fa-solid fa-pen text-green"></i> </button> 
             <button commandfor="dialog" class="rounded-md px-2.5 py-1.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20" 
             onclick="openDeleteModal('${idee.id}')">
              <i class="fa-solid fa-trash text-red-500"></i> 
              </button>

        </div>
    `).join("");

    total.textContent = message.length;
}
//filtrer par categorie
const boutons = document.querySelectorAll(".btn-filtre");

boutons.forEach((btn) => {
    btn.addEventListener("click", async () => {

        const categorie = btn.dataset.categorie;

        //  RESET 
        boutons.forEach((b) => {
            b.classList.remove("bg-green", "text-black", "font-bold");
            b.classList.add("bg-[#111a2e]", "border", "border-[#26324a]");
        });

        // ACTIVE BUTTON
        btn.classList.add("bg-green", "text-black", "font-bold");
        btn.classList.remove("bg-[#111a2e]", "border", "border-[#26324a]");

        // QUERY SUPABASE
        let query = supabaseClient
            .from("messages")
            .select("*");

        if (categorie !== "tout") {
            query = query.eq("categorie", categorie);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Erreur filtre :", error);
            return;
        }

        afficherCartes();
    });
});

const input = document.getElementById('titre')
// fonction de validation du titre de l'idee
function validationTitre(){
const inputError = document.getElementById('titre-error')
    const titre = input.value.trim()
    const regex = /^[A-Za-zÀ-ÿ\s]{3,}$/;
    if(!regex.test(titre)){
        inputError.textContent="Veillez bien saisir votre idee qui a plus de 3lettres"
        inputError.style.color="red"
        input.classList.add('border-red-500')
        return false
    }

    if(/(.)\1{2,}/.test(titre)){
        inputError.textContent="Trop de caractere identique repeter"
        inputError.style.color="red"
        input.classList.add('border-red-500')
        return false
    }

    inputError.textContent=""
    input.classList.remove('border-red-500')
    input.classList.add('border-green')
    return true
}

const description = document.querySelector('textarea')

// fonction de validation de la description
function validationDescription(){
    const erreurDescription = document.getElementById('textarea-error')
    const nombreSaisi = document.getElementById('count')
    const maxlettre = 255
    const valeur = description.value.trim()

    // oblige au user de saisir
    if(valeur.length===0){
        erreurDescription.textContent="Vous devez saisir obligatoirement"
        erreurDescription.style.color="red"
        description.classList.add('border-red-500')
        return false
    }

    // evite la repetition de lettre identique
    if(/(.)\1{2,}/.test(valeur)){
        erreurDescription.textContent="Trop de caractere identique repeter"
        erreurDescription.style.color="red"
        description.classList.add('border-red-500')
        nombreSaisi.textContent=`${valeur.length} / ${maxlettre}`
        nombreSaisi.classList.add('text-white')
        return false
    }

    // evite de saisir moins de 15 caracters
    if(valeur.length < 15){
        erreurDescription.textContent="Minimum vous devez saisir plus de 15"
        erreurDescription.style.color="red"
        description.classList.add('border-red-500')
        nombreSaisi.textContent=`${valeur.length} / ${maxlettre}`
        nombreSaisi.classList.add('text-white')

        return false
    }

    // evite de saisir plus de 255 caracteres
    if(valeur.length > 255){
        erreurDescription.textContent="Oups vous avez depasse la limite de saisie"
        erreurDescription.style.color="red"
        description.classList.add('border-red-500')
        nombreSaisi.textContent=`${valeur.length} / ${maxlettre}`
        nombreSaisi.classList.remove('text-white')
        nombreSaisi.classList.add('text-red-500')

        return false
    }

    erreurDescription.textContent=""
    description.classList.remove('border-red-500')
    description.classList.add('border-green')
    nombreSaisi.textContent=`${valeur.length} / ${maxlettre}`
    nombreSaisi.classList.remove('text-red-500')
    nombreSaisi.classList.remove('text-white')
    return true
}

// validation automatique
input.addEventListener("input",validationTitre)
description.addEventListener("input", validationDescription)
// Formulaire
const btn = document.getElementById("btn")
document.getElementById("form")
.addEventListener("submit",async (e) => {

    e.preventDefault();
    const titreOk = validationTitre()
    const descriptionOk = validationDescription()

    // empeche la validation du formulaire
    if(!titreOk || !descriptionOk){
        btn.textContent="verifie d'abord ton erreur"
        btn.classList.add(
        "bg-red-500",
        );
        return
    }

    const form = e.target;
    const data = getForm(form);

    btn.disabled= true
    btn.textContent="Analyse de l'idee par l'IA..."
    btn.classList.remove(
        "bg-red-500",
        );
    btn.classList.add(
    "bg-gray-500",
    "cursor-not-allowed"
);
    

    try{
    await addIdee(data)

    afficherCartes();
    form.reset();


    }
    catch (error){
        console.error(error);
    }
    finally{
        btn.disabled= false
        btn.textContent="Ajouter une idee"
        btn.classList.remove(
        "bg-red-500",
        ); 
        btn.classList.remove(
    "bg-gray-500",
    "cursor-not-allowed"
);
        btn.classList.add("bg-green")

    }

});



afficherCartes();
// filtreCategorie();

// delete
let deleteId = null;

function openDeleteModal(id){

    console.log("ID reçu:", id);

    if(!id){
        console.error("ID invalide");
        return;
    }

    deleteId = id;
    document.getElementById("dialog").showModal();
}
async function confirmDelete(){

    console.log("deleteId:", deleteId);

    if(!deleteId){
        console.error("deleteId null → delete annulé");
        return;
    }

    const { error } = await supabaseClient
        .from("messages")
        .delete()
        .eq("id", deleteId);

    if(error){
        console.error(error);
        return;
    }

    deleteId = null;
    document.getElementById("dialog").close();

    await afficherCartes();
}

//update
// ouvrir modal modification
async function editIdee(id){
    const message = await loadMessages()
    if(!Array.isArray(message)){
        console.error("message n'est pas un tableau ", message)
        return
    }
    const idee = message.find(
        item => String(item.id) === String(id)
    );

    if(!idee) return;

    document.getElementById("editId").value =idee.id;

    document.getElementById("editTitre").value =idee.titre;

    document.getElementById("editCategorie").value =idee.categorie;

    document.getElementById("editDescription").value =idee.description;

    document.getElementById("editDialog").showModal();
}


// fermer modal
function closeEditModal(){

    document.getElementById("editDialog")
        .close();
}


// sauvegarder modification

document.getElementById("editForm")
.addEventListener("submit",async (e)=>{

    e.preventDefault();
    const message =await loadMessages()

    const id = (document.getElementById("editId").value);

    const titre =document.getElementById("editTitre").value;

    const categorie =document.getElementById("editCategorie").value;

    const description =document.getElementById("editDescription").value;

  const {data,error} = await supabaseClient
    .from("messages")
    .update({
        titre,
        categorie,
        description
    })
    .eq("id", id);

    if(error){
        console.error("Erreur udpate", error)
        return
    }
    await loadMessages()
    afficherCartes()
    closeEditModal()

});

// ajouter une fonction async integrant l'ia en ligne avec la cle de OpenRouter

async function genericCategorie(titre,description) {

    const prompt =`
    Tu es un assistant de classification.
    Tu es un assistant de classification.

    Choisis UNE SEULE catégorie :

    - pedagogie 
    - campus 
    - amelioration 
    - evenement

    Réponds uniquement par :
    evenement
    pedagogie
    campus
    amelioration
    Règles :
    - Répond uniquement avec un seul mot
    - Pas d'explication
    - Pas de texte en plus

    Titre: ${titre}
    Description: ${description}
        `;

    // const cle =process.env.OPENROUTER_API_KEY;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
        method:"POST",
        headers:{
            authorization:`Bearer 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`,
            "content-Type":"application/json"
        },
        body:JSON.stringify({
            model:"openai/gpt-4o-mini",
            messages: [
            {
                role: "system",
                content: "Return only one word: pedagogie, campus, amelioration, evenement."
            },
            {
                role: "user",
                content: `${titre} - ${description}`
            },
            {
                    role: "user",
                    content: prompt
            }
            ],
            temperature: 0
        })
    })
     const data = await response.json();
 console.log(response.status)
    console.log(data)
    const result = data.choices[0].message.content.trim();
   
    return result;

    
}


