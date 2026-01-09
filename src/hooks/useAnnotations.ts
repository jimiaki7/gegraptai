import { useState, useEffect, useCallback } from 'react';
import { Annotation } from '../types';
import { supabase } from '../lib/supabase';

export function useAnnotations(user: any) {
    const [annotations, setAnnotations] = useState<Record<string, Annotation>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Load from Supabase on mount/user change
    useEffect(() => {
        if (!user) {
            setAnnotations({});
            setIsLoading(false);
            return;
        }

        async function fetchAnnotations() {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('annotations')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;

                if (data) {
                    const mapped: Record<string, Annotation> = {};
                    data.forEach((row: any) => {
                        mapped[row.word_id] = {
                            wordId: row.word_id,
                            morphTag: row.morph_tag || '',
                            exegeticalNote: row.exegetical_note || '',
                            highlightColor: row.highlight_color || '',
                            updatedAt: new Date(row.updated_at).getTime(),
                        };
                    });
                    setAnnotations(mapped);
                }
            } catch (e) {
                console.error('Failed to load annotations from Supabase:', e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAnnotations();
    }, [user]);

    const getAnnotation = useCallback((wordId: string): Annotation | undefined => {
        return annotations[wordId];
    }, [annotations]);

    const updateAnnotation = useCallback(async (wordId: string, updates: Partial<Omit<Annotation, 'wordId'>>) => {
        if (!user) return;

        const now = Date.now();
        const current = annotations[wordId] || {
            wordId,
            morphTag: '',
            exegeticalNote: '',
            highlightColor: '',
        };

        const newAnnotation: Annotation = {
            ...current,
            ...updates,
            updatedAt: now,
        };

        // Update local state immediately
        setAnnotations(prev => ({
            ...prev,
            [wordId]: newAnnotation,
        }));

        // Sync with Supabase
        setIsSyncing(true);
        try {
            const { error } = await supabase
                .from('annotations')
                .upsert({
                    user_id: user.id,
                    word_id: wordId,
                    morph_tag: newAnnotation.morphTag,
                    exegetical_note: newAnnotation.exegeticalNote,
                    highlight_color: newAnnotation.highlightColor,
                    updated_at: new Date(now).toISOString(),
                }, { onConflict: 'user_id,word_id' });

            if (error) throw error;
        } catch (e) {
            console.error('Supabase sync error:', e);
        } finally {
            setIsSyncing(false);
        }
    }, [annotations, user]);

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
        a.download = `gegraptai_annotations_${new Date().toISOString().split('T')[0]}.json`;
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
        isLoading,
        isSyncing,
        getAnnotation,
        updateMorphTag,
        updateNote,
        updateColor,
        exportAnnotations,
        importAnnotations,
    };
}

