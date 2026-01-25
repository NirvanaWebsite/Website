import React from 'react';
import { Filter } from 'lucide-react';

const Filters = ({ filters, setFilters, uniqueValues }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center text-orange-600 mr-2">
                <Filter size={20} className="mr-2" />
                <span className="font-semibold">Filters</span>
            </div>

            <select
                name="year"
                value={filters.year}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-gray-700 bg-white"
            >
                <option value="">All Years</option>
                {uniqueValues.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>

            <select
                name="domain"
                value={filters.domain}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-gray-700 bg-white"
            >
                <option value="">All Domains</option>
                {uniqueValues.domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                ))}
            </select>

            <select
                name="role"
                value={filters.role}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-gray-700 bg-white"
            >
                <option value="">All Roles</option>
                {uniqueValues.roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>

            {(filters.year || filters.domain || filters.role) && (
                <button
                    onClick={() => setFilters({ year: '', domain: '', role: '' })}
                    className="text-sm text-red-500 hover:text-red-700 font-medium ml-auto"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default Filters;
