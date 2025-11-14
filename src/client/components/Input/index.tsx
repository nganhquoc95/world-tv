import React from 'react';
import './Input.css';

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    type?: string;
    disabled?: boolean;
}

function Input({
    value,
    onChange,
    placeholder = '',
    className = '',
    type = 'text',
    disabled = false
}: InputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`input ${className}`}
            disabled={disabled}
        />
    );
}

export default Input;