import React, { useState, useRef, useEffect, useCallback, useId } from "react";

interface DropdownOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

interface DropdownProps {
    options: DropdownOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    clearable?: boolean;
    className?: string;
    dropdownClassName?: string;
    optionClassName?: string;
    maxHeight?: number;
    label?: string;
    error?: string;
    required?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = "Tanlang...",
    disabled = false,
    searchable = false,
    clearable = false,
    className = "",
    dropdownClassName = "",
    optionClassName = "",
    maxHeight = 240,
    label,
    error,
    required = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 1. Unique ID yaratish - har bir dropdown uchun alohida ID
    const dropdownId = useId();
    const listboxId = `${dropdownId}-listbox`;
    const searchInputId = `${dropdownId}-search`;

    const filteredOptions = searchable
        ? options.filter((option) =>
              option.label.toLowerCase().includes(searchValue.toLowerCase())
          )
        : options;

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setSearchValue("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setSearchValue("");
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (!isOpen) return;

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    setFocusedIndex((prev) =>
                        prev < filteredOptions.length - 1 ? prev + 1 : prev
                    );
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                    break;
                case "Enter":
                    event.preventDefault();
                    if (
                        focusedIndex >= 0 &&
                        focusedIndex < filteredOptions.length
                    ) {
                        handleSelect(filteredOptions[focusedIndex]);
                    }
                    break;
                case "Tab":
                    setIsOpen(false);
                    setSearchValue("");
                    break;
            }
        },
        [isOpen, filteredOptions, focusedIndex]
    );

    const handleSelect = (option: DropdownOption) => {
        if (option.disabled) return;
        onChange?.(option.value);
        setIsOpen(false);
        setSearchValue("");
        setFocusedIndex(-1);
    };

    const handleClear = (event: React.MouseEvent) => {
        event.stopPropagation();
        onChange?.("");
        setIsOpen(false);
        setSearchValue("");
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (isOpen) {
                setSearchValue("");
            }
        }
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            {label && (
                <label
                    htmlFor={searchable ? searchInputId : undefined}
                    className='block text-sm font-medium text-gray-700 mb-2'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}

            <div
                role='combobox'
                aria-controls={listboxId} // 2. listbox bilan bog'lash
                aria-expanded={isOpen}
                aria-haspopup='listbox'
                aria-label={label ? undefined : placeholder} // 3. Label bo'lmasa, placeholder ni aria-label qilib ishlatish
                aria-labelledby={label ? `${dropdownId}-label` : undefined}
                className={`
          relative w-full px-4 py-3 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200
          ${
              disabled
                  ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                  : "border-gray-300/50 hover:border-blue-400/50"
          }
          ${isOpen ? "border-blue-500 ring-2 ring-blue-200" : ""}
          ${error ? "border-red-500 ring-2 ring-red-200" : ""}
        `}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}>
                <div className='flex items-center justify-between'>
                    <span
                        className={`${
                            selectedOption ? "text-gray-900" : "text-gray-500"
                        }`}>
                        {selectedOption?.label || placeholder}
                    </span>
                    <div className='flex items-center space-x-2'>
                        {clearable && selectedOption && !disabled && (
                            <button
                                type='button'
                                onClick={handleClear}
                                className='text-gray-400 hover:text-red-500 transition-colors'
                                aria-label={`${selectedOption.label} tanlamasini tozalash`}>
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M6 18L18 6M6 6l12 12'
                                    />
                                </svg>
                            </button>
                        )}
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            aria-hidden='true'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className={`
                        absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg overflow-auto
                        ${dropdownClassName}
                    `}
                    style={{ maxHeight: `${maxHeight}px` }}>
                    {searchable && (
                        <div className='p-3 border-b border-gray-200'>
                            <input
                                ref={searchInputRef}
                                id={searchInputId}
                                type='text'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder='Qidiruv...'
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                onClick={(e) => e.stopPropagation()}
                                autoComplete='off'
                                aria-label={
                                    label ? `${label} uchun qidiruv` : "Qidiruv"
                                } // 1. Inputga accessible name berish
                            />
                        </div>
                    )}

                    <div
                        className='overflow-y-auto'
                        role='listbox'
                        id={listboxId} // 2. ID qo'shish
                    >
                        {filteredOptions.length === 0 ? (
                            <div className='px-4 py-3 text-sm text-gray-500 text-center'>
                                {searchable && searchValue
                                    ? "Hech nima topilmadi"
                                    : "Variantlar mavjud emas"}
                            </div>
                        ) : (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={option.value}
                                    role='option'
                                    id={`${listboxId}-option-${option.value}`}
                                    aria-selected={
                                        selectedOption?.value === option.value
                                    }
                                    aria-disabled={option.disabled}
                                    className={`
                                        px-4 py-3 cursor-pointer transition-colors duration-150
                                        ${
                                            option.disabled
                                                ? "text-gray-400 cursor-not-allowed bg-gray-50"
                                                : "hover:bg-blue-50 text-gray-900"
                                        }
                                        ${
                                            focusedIndex === index
                                                ? "bg-blue-100"
                                                : ""
                                        }
                                        ${
                                            selectedOption?.value ===
                                            option.value
                                                ? "bg-blue-50 font-medium"
                                                : ""
                                        }
                                        ${optionClassName}
                                    `}
                                    onClick={() => handleSelect(option)}
                                    onMouseEnter={() => setFocusedIndex(index)}>
                                    {option.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
        </div>
    );
};

export default Dropdown;
