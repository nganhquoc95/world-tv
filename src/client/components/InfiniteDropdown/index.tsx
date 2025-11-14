import React, { useState, useRef, useEffect, useMemo } from 'react';
import './InfiniteDropdown.css';

interface DropdownOption {
    value: string;
    label: string;
}

interface InfiniteDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
    pageSize?: number;
}

function InfiniteDropdown({
    options,
    value,
    onChange,
    placeholder,
    className = '',
    pageSize = 20
}: InfiniteDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadedCount, setLoadedCount] = useState(pageSize);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    // Get currently visible options (for infinite scroll)
    const visibleOptions = filteredOptions.slice(0, loadedCount);

    // Find selected option
    const selectedOption = options.find(option => option.value === value);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle scroll to load more items
    const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            // Load more items when near bottom
            setLoadedCount(prev => Math.min(prev + pageSize, filteredOptions.length));
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < visibleOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : visibleOptions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && visibleOptions[selectedIndex]) {
                    handleSelect(visibleOptions[selectedIndex].value);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSearchTerm('');
                setSelectedIndex(-1);
                break;
        }
    };

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(-1);
        setLoadedCount(pageSize); // Reset loaded count
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        setLoadedCount(pageSize); // Reset loaded count when searching
        setSelectedIndex(-1);

        // If user types something that matches an option exactly, select it
        const exactMatch = options.find(option =>
            option.value.toLowerCase() === newValue.toLowerCase() ||
            option.label.toLowerCase() === newValue.toLowerCase()
        );
        if (exactMatch) {
            onChange(exactMatch.value);
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
        setLoadedCount(pageSize);
    };

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    return (
        <div className={`infinite-dropdown ${className}`} ref={dropdownRef}>
            <div className="infinite-dropdown-input-container">
                <input
                    type="text"
                    value={isOpen ? searchTerm : (selectedOption?.label || value || '')}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="infinite-dropdown-input"
                    autoComplete="off"
                />
                {value && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelect('');
                        }}
                        className="infinite-dropdown-clear"
                        title="Clear selection"
                    >
                        ×
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="infinite-dropdown-menu">
                    <ul
                        ref={listRef}
                        className="infinite-dropdown-list"
                        onScroll={handleScroll}
                    >
                        {/* Clear option */}
                        <li
                            className={`infinite-dropdown-item ${selectedIndex === 0 ? 'selected' : ''}`}
                            onClick={() => handleSelect('')}
                        >
                            <span className="clear-option">Clear selection</span>
                        </li>

                        {visibleOptions.map((option, index) => (
                            <li
                                key={option.value}
                                className={`infinite-dropdown-item ${
                                    option.value === value ? 'active' : ''
                                } ${selectedIndex === index + 1 ? 'selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </li>
                        ))}

                        {loadedCount < filteredOptions.length && (
                            <li className="infinite-dropdown-loading">
                                Loading more...
                            </li>
                        )}
                    </ul>

                    {filteredOptions.length === 0 && searchTerm && (
                        <div className="infinite-dropdown-no-results">
                            No results found for "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default InfiniteDropdown;