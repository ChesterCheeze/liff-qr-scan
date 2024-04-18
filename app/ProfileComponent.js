'use client'

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";
import action from "./action";


function LIFF() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        liff.use(new LiffMockPlugin());

        async function initLIFF() {
            try {
                await liff.init({ liffId: process.env.LIFF_ID, mock: true, });
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
    
    return (
        <>
            {profile && (
            <>
                <div>
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
                </div>
                <form action={action}>
                    <input type="hidden" name="lineId" value={profile.userId} />
                    <input type="hidden" name="name" value={profile.displayName} />
                    <input type="hidden" name="pictureUrl" value={profile.pictureUrl} />
                    <button type="submit">Register</button>
                </form>
            </>
            )}
        </>
    )
}

export default LIFF;