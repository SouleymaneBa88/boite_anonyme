OPENROUTER_API_KEY = "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"
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
            authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "content-Type":"application/json"
        },
        body:JSON.stringify({
            model:"openai/gpt-4o-mini",
            messages: [
  {
    role: "system",
    content: "Tu es un classificateur. Réponds uniquement par: pedagogie, campus, amelioration, evenement. Un seul mot, sans explication."
  },
  {
    role: "user",
    content: `Titre: ${titre}\nDescription: ${description}`
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
