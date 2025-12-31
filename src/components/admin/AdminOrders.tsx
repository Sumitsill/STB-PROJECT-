import React, { useState } from 'react';

interface Order {
    id: string;
    customer: string;
    item: string;
    date: string;
    status: 'Pending' | 'In Progress' | 'Delivered';
    contributor: string;
}

const AdminOrders = () => {
    // Mock Data
    const [orders, setOrders] = useState<Order[]>([
        { id: 'ORD-001', customer: 'John Doe', item: 'Wool Suit', date: '2024-12-20', status: 'In Progress', contributor: 'Master Luigi' },
        { id: 'ORD-002', customer: 'Jane Smith', item: 'Silk Saree', date: '2024-12-22', status: 'Pending', contributor: 'Unassigned' },
        { id: 'ORD-003', customer: 'Bob Wilson', item: 'Linen Shirt', date: '2024-12-25', status: 'Delivered', contributor: 'Sarah Jones' },
    ]);

    const contributors = ['Master Luigi', 'Sarah Jones', 'Mike Brown', 'Unassigned'];

    const handleStatusChange = (id: string, newStatus: Order['status']) => {
        setOrders(orders.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        ));
    };

    const handleContributorChange = (id: string, newContributor: string) => {
        setOrders(orders.map(order =>
            order.id === id ? { ...order, contributor: newContributor } : order
        ));
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem' }}>Order Management</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--color-text)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-primary-light)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Order ID</th>
                            <th style={{ padding: '1rem' }}>Customer</th>
                            <th style={{ padding: '1rem' }}>Item</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Assigned To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{order.id}</td>
                                <td style={{ padding: '1rem' }}>{order.customer}</td>
                                <td style={{ padding: '1rem' }}>{order.item}</td>
                                <td style={{ padding: '1rem' }}>{order.date}</td>
                                <td style={{ padding: '1rem' }}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'var(--color-cream)',
                                            border: '1px solid var(--color-primary-light)',
                                            padding: '4px 8px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <select
                                        value={order.contributor}
                                        onChange={(e) => handleContributorChange(order.id, e.target.value)}
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'var(--color-cream)',
                                            border: '1px solid var(--color-primary-light)',
                                            padding: '4px 8px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {contributors.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
