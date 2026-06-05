
// ajouter une fonction async integrant l'ia en ligne avec la cle de OpenRouter

export async function genericCategorie(titre,description) {

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
            authorization:`Bearer ${import.meta.env.VITE_OPEN_ROUTER_KEY}`,
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


