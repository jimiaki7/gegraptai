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

    const handleSubmit = useCallback(() => {
        onSubmit(value.trim());
    }, [value, onSubmit]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }, [handleSubmit]);

    return (
        <div className="reference-input-wrapper">
            <input
                type="text"
                className={`reference-input ${error ? 'error' : ''}`}
                placeholder="Ex: Gen 1:1, 10; Ps 23; Jn 1:1"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                aria-label="Enter biblical reference (聖書箇所を入力)"
            />
            <button
                className="reference-submit-button"
                onClick={handleSubmit}
                aria-label="Submit"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        </div>
    );
}
