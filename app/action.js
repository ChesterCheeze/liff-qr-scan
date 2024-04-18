'use server'

import axios from 'axios';

export default async function regisUser(formData) {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    
}