import React, { useState } from 'react';
import { FaUserTie, FaIndustry, FaStar, FaCheck, FaTimes } from 'react-icons/fa';

interface Contributor {
    id: string;
    name: string;
    role: string;
    status: 'Active' | 'Inactive' | 'On Duty' | 'Off Duty';
    rating: number;
    serviceAreas: string[];
    type: 'Individual';
}

interface ManufacturingUnit {
    id: string;
    name: string;
    capacity: number;
    currentLoad: number;
    status: 'Accepting' | 'Full';
    rating: number;
    serviceAreas: string[];
    type: 'Manufacturing';
}

const AdminContributors = () => {
    const [activeTab, setActiveTab] = useState<'individuals' | 'manufacturing'>('individuals');

    const [individuals, setIndividuals] = useState<Contributor[]>([
        { id: 'IND001', name: 'Master Luigi', role: 'Head Tailor', status: 'On Duty', rating: 4.9, type: 'Individual', serviceAreas: ['Downtown', 'West End'] },
        { id: 'IND002', name: 'Mario Rossi', role: 'Junior Tailor', status: 'Off Duty', rating: 4.5, type: 'Individual', serviceAreas: ['North Hills'] },
        { id: 'IND003', name: 'Giulia Verdi', role: 'Seamstress', status: 'On Duty', rating: 4.8, type: 'Individual', serviceAreas: ['Downtown', 'South Bay'] },
    ]);

    const [units, setUnits] = useState<ManufacturingUnit[]>([
        { id: 'MFG001', name: 'Central GFT Unit', capacity: 100, currentLoad: 85, status: 'Accepting', rating: 4.7, type: 'Manufacturing', serviceAreas: ['All Regions'] },
        { id: 'MFG002', name: 'Eastside Textiles', capacity: 50, currentLoad: 50, status: 'Full', rating: 4.2, type: 'Manufacturing', serviceAreas: ['Eastside', 'North Hills'] },
    ]);

    const handleAllotOrder = (contributor: Contributor) => {
        if (contributor.status !== 'On Duty') {
            alert(`${contributor.name} is currently Off Duty. Cannot allot order.`);
            return;
        }

        const orderLocation = window.prompt("Enter Order Location (e.g., Downtown):");
        if (!orderLocation) return;

        if (!contributor.serviceAreas.includes(orderLocation)) {
            alert(`Error: ${contributor.name} does not serve ${orderLocation}.`);
            return;
        }

        const customerRating = window.prompt("Enter Customer Rating (Optional, for context):");
        console.log(`Order alloted to ${contributor.name}. Customer Rating context: ${customerRating}`);
        alert(`Order successfully alloted to ${contributor.name}!`);
    };

    const handleAllotBatch = (unit: ManufacturingUnit) => {
        if (unit.status === 'Full') {
            alert(`${unit.name} is currently at full capacity.`);
            return;
        }

        const batchLocation = window.prompt("Enter Batch Location:");
        if (!batchLocation) return;

        // specific check for units if they have service areas or if they serve all
        if (!unit.serviceAreas.includes('All Regions') && !unit.serviceAreas.includes(batchLocation)) {
            alert(`Error: ${unit.name} does not serve ${batchLocation}.`);
            return;
        }

        const batchSize = window.prompt("Enter Batch Size:");
        if (batchSize) {
            alert(`Batch of size ${batchSize} alloted to ${unit.name}`);
        }
    };


    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--color-gold)', margin: 0 }}>Contributor Management</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('individuals')}
                        className={`btn ${activeTab === 'individuals' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FaUserTie /> Individuals
                    </button>
                    <button
                        onClick={() => setActiveTab('manufacturing')}
                        className={`btn ${activeTab === 'manufacturing' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FaIndustry /> Manufacturing Units
                    </button>
                </div>
            </div>

            {activeTab === 'individuals' && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--color-text)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Rating</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Service Areas</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {individuals.map(ind => (
                                <tr key={ind.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{ind.id}</td>
                                    <td style={{ padding: '1rem' }}>{ind.name}</td>
                                    <td style={{ padding: '1rem' }}>{ind.role}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            backgroundColor: ind.status === 'On Duty' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                            color: ind.status === 'On Duty' ? '#4CAF50' : '#F44336',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.85rem'
                                        }}>
                                            {ind.status === 'On Duty' ? <FaCheck size={10} /> : <FaTimes size={10} />}
                                            {ind.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FFD700' }}>
                                            <FaStar size={12} /> {ind.rating}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                            {ind.serviceAreas.map(area => (
                                                <span key={area} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{area}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => handleAllotOrder(ind)}
                                            className="btn btn-sm btn-primary"
                                            disabled={ind.status !== 'On Duty'}
                                            style={{ opacity: ind.status !== 'On Duty' ? 0.5 : 1, cursor: ind.status !== 'On Duty' ? 'not-allowed' : 'pointer' }}
                                        >
                                            Allot Order
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'manufacturing' && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--color-text)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Unit ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Unit Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Capacity</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Load</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Rating</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Service Areas</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map(unit => (
                                <tr key={unit.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{unit.id}</td>
                                    <td style={{ padding: '1rem' }}>{unit.name}</td>
                                    <td style={{ padding: '1rem' }}>{unit.capacity}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                width: '80px',
                                                height: '6px',
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: '3px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${(unit.currentLoad / unit.capacity) * 100}%`,
                                                    height: '100%',
                                                    background: unit.status === 'Full' ? '#F44336' : '#4CAF50'
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '0.85rem' }}>{Math.round((unit.currentLoad / unit.capacity) * 100)}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            backgroundColor: unit.status === 'Accepting' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                            color: unit.status === 'Accepting' ? '#4CAF50' : '#F44336',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.85rem'
                                        }}>
                                            {unit.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FFD700' }}>
                                            <FaStar size={12} /> {unit.rating}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                            {unit.serviceAreas.map(area => (
                                                <span key={area} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{area}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => handleAllotBatch(unit)}
                                            className="btn btn-sm btn-primary"
                                            disabled={unit.status === 'Full'}
                                            style={{ opacity: unit.status === 'Full' ? 0.5 : 1, cursor: unit.status === 'Full' ? 'not-allowed' : 'pointer' }}
                                        >
                                            Allot Batch
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminContributors;
