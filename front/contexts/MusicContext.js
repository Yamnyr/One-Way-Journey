// contexts/MusicContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

const MusicContext = createContext(null); // Important

export const MusicProvider = ({ children }) => {
    const [isMusicPlaying, setIsMusicPlaying] = useState(true);
    const soundRef = useRef(null);

    useEffect(() => {
        const loadAndPlay = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../assets/music.mp3'),
                    { isLooping: true }
                );
                soundRef.current = sound;
                await sound.playAsync();
            } catch (e) {
                console.error('Erreur audio :', e);
            }
        };

        loadAndPlay();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const toggleMusic = async () => {
        if (!soundRef.current) return;

        if (isMusicPlaying) {
            await soundRef.current.pauseAsync();
        } else {
            await soundRef.current.playAsync();
        }
        setIsMusicPlaying(!isMusicPlaying);
    };

    return (
        <MusicContext.Provider value={{ isMusicPlaying, toggleMusic }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);
