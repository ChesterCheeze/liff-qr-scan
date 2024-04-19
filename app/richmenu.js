import axios from 'axios';

const setRichMenu = async (userId, richMenuId, channelAccessToken) => {
    try {
        const response = await axios.post(`https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`, null
        , {headers: {
            'Authorization': `Bearer ${channelAccessToken}`,
            'Content-Type': 'application/json',
        }});
        console.log(response);
    } catch(error) {
        console.log(error);
    }
}

