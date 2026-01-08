import { useState, useEffect, useCallback } from 'react';
import { Annotation } from '../types';

const STORAGE_KEY = 'bible-study-annotations';

export function useAnnotations() {
    const [annotations, setAnnotations] = useState<Record<string, Annotation>>({});

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setAnnotations(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load annotations:', e);
        }
    }, []);

    // Save to localStorage when annotations change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
        } catch (e) {
            console.error('Failed to save annotations:', e);
        }
    }, [annotations]);

    const getAnnotation = useCallback((wordId: string): Annotation | undefined => {
        return annotations[wordId];
    }, [annotations]);

    const updateAnnotation = useCallback((wordId: string, updates: Partial<Omit<Annotation, 'wordId'>>) => {
        setAnnotations(prev => ({
            ...prev,
            [wordId]: {
                wordId,
                morphTag: prev[wordId]?.morphTag || '',
                exegeticalNote: prev[wordId]?.exegeticalNote || '',
                ...updates,
                updatedAt: Date.now(),
            },
        }));
    }, []);

    const updateMorphTag = useCallback((wordId: string, morphTag: string) => {
        updateAnnotation(wordId, { morphTag });
    }, [updateAnnotation]);

    const updateNote = useCallback((wordId: string, exegeticalNote: string) => {
        updateAnnotation(wordId, { exegeticalNote });
    }, [updateAnnotation]);

    const updateColor = useCallback((wordId: string, highlightColor: string) => {
        updateAnnotation(wordId, { highlightColor });
    }, [updateAnnotation]);


    const exportAnnotations = useCallback(() => {
        const dataStr = JSON.stringify(annotations, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bible_study_annotations_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [annotations]);

    const importAnnotations = useCallback((file: File) => {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const parsed = JSON.parse(content);
                    // Basic validation check
                    if (typeof parsed !== 'object') {
                        throw new Error('Invalid JSON format');
                    }
                    setAnnotations(prev => ({ ...prev, ...parsed }));
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }, []);

    return {
        annotations,
        getAnnotation,
        updateMorphTag,
        updateNote,
        updateColor,
        exportAnnotations,
        importAnnotations,
    };
}
