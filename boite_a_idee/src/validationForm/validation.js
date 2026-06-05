const input = document.getElementById('titre')
// fonction de validation du titre de l'idee
export function validationTitre(){
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
export function validationDescription(){
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