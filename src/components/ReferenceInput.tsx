import { useState, useCallback, KeyboardEvent, ChangeEvent } from 'react';

interface ReferenceInputProps {
    onSubmit: (reference: string) => void;
    error?: string | null;
}

export function ReferenceInput({ onSubmit, error }: ReferenceInputProps) {
    const [value, setValue] = useState('');

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmit(value.trim());
        }
    }, [value, onSubmit]);

    return (
        <div className="reference-input-wrapper">
            <input
                type="text"
                className={`reference-input ${error ? 'error' : ''}`}
                placeholder="例: Gen 1:1, 10, 12; Ps 23, 24"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                aria-label="聖書箇所を入力"
            />
        </div>
    );
}
