import React from 'react';

const Dropdown = ({ label, items, value, onChange, placeholder }) => {
    return (
        <div className="dropdown">
            <label>
                {label}
                <select
                    value={value}
                    onChange={onChange}
                    required
                >
                    <option value="">{placeholder}</option>
                    {items.map(item => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default Dropdown;
