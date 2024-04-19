'use server'

import axios from 'axios';

    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

export default async function regisUser(formData) {

    try {
    const csrf = await axios.get('http://localhost:8000/sanctum/csrf-cookie');
    const response = await axios.post('http://localhost:8000/api/lineuser', {
    lineId: formData.get('lineId'),
    name: formData.get('name'),
    pictureUrl: formData.get('pictureUrl'),
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Origin": "http://localhost:3000",
        }
    });
    } catch (error) {
    console.error(error);
    }
}