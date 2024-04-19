'use client'

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";
import action from "./action";
import axios from 'axios';
import { setRichMenu } from './richmenu';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;


function LIFF() {
    const [profile, setProfile] = useState(null);
    const [register, setRegister] = useState(null);

    useEffect(() => {
        liff.use(new LiffMockPlugin());

        async function initLIFF() {
            try {
                await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID, mock: true });
                if (!liff.isLoggedIn()) {
                    liff.login();
                }
                const userProfile = await liff.getProfile();
                if (!userProfile.pictureUrl) {
                    userProfile.pictureUrl = 'https://winterbear.in/wp-content/uploads/2023/02/LF-CHARACTERS-01.webp';
                }
                setProfile(userProfile);
            } catch (error) {
                console.error("Liff initialize failed:", error);
            }
        }
        initLIFF();
    }, []);

    useEffect(() => {
        const getCSRFToken = async () => {
            try {
                await axios.get('http://localhost:8000/sanctum/csrf-cookie');
            } catch (error) {
                console.error(error);
            }
        }
        getCSRFToken();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault(); 
       try {
        const response = await axios.post('http://localhost:8000/api/lineuser', {
        lineId: e.target.lineId.value,
        name: e.target.name.value,
        pictureUrl: e.target.pictureUrl.value,
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
            }
        });
        setRegister(response.data);
        localStorage.setItem('api_token', response.data.api_token);
        if (response.data.api_token) {
            await setRichMenu(profile.userId, process.env.NEXT_PUBLIC_MENU_ID, process.env.NEXT_PUBLIC_ACCESS_TOKEN);
            liff.closeWindow();
        }
       } catch (error) {
            console.error(error);
       }
    }
    
    return (
        <>
            {profile && (
            <>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <img
                        src={profile.pictureUrl}
                        alt={profile.displayName}
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            objectPosition: 'top',
                        }} />
                    <p>{profile.displayName}</p>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="lineId" value={profile.userId} />
                    <input type="hidden" name="name" value={profile.displayName} />
                    <input type="hidden" name="pictureUrl" value={profile.pictureUrl} />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Register</button>
                </form>
                {register && <p>{register.message}</p>}
            </div>
            </>
            )}
        </>
    )
}

export default LIFF;