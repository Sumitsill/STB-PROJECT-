import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminOrders from '../components/admin/AdminOrders';
import AdminContributors from '../components/admin/AdminContributors';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'orders' | 'contributors'>('orders');

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--gradient-bg)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)'
        }}>
            {/* Header */}
            <header style={{
                padding: '1.5rem 2rem',
                background: 'rgba(10, 25, 47, 0.9)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-primary-light)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                        style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-gold)' }}
                    >
                        KM Admin
                    </div>
                </div>
                <button
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                    onClick={() => navigate('/')}
                >
                    Logout
                </button>
            </header>

            <div className="container" style={{ padding: '2rem 0' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Orders Management
                    </button>
                    <button
                        onClick={() => setActiveTab('contributors')}
                        className={`btn ${activeTab === 'contributors' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Contributor Management
                    </button>
                </div>

                {/* Content */}
                <div className="fade-in">
                    {activeTab === 'orders' ? <AdminOrders /> : <AdminContributors />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
