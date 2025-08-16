// netlify/functions/create-roblox-game.js

exports.handler = async function(event, context) {
    // Salli vain POST-pyynnöt
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Lue selaimelta lähetetty data
        const { templatePlaceIdToUse } = JSON.parse(event.body);
        
        // **TÄRKEÄÄ**: Hae API-avain turvallisesti Netlifyn ympäristömuuttujista
        const apiKey = process.env.ROBLOX_API_KEY;

        if (!apiKey) {
            throw new Error("API-avainta ei ole määritetty palvelimella.");
        }

        // Tee kutsu Robloxin API:in
        const robloxResponse = await fetch('https://apis.roblox.com/universes/v1/universes', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                templatePlaceIdToUse: templatePlaceIdToUse
            })
        });

        const data = await robloxResponse.json();

        // Palauta Robloxin vastaus selaimelle
        return {
            statusCode: robloxResponse.status,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Virhe funktiossa:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Palvelimella tapahtui virhe.' })
        };
    }
};
