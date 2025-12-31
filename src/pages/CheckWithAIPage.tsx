import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckWithAIPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [orderId, setOrderId] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultImage, setResultImage] = useState(null);

    const handleOrderIdSubmit = (e) => {
        e.preventDefault();
        if (orderId.trim().length > 0) {
            setStep(2);
        } else {
            alert("Please enter a valid Order ID");
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserImage(file);
            processImage(file);
        }
    };

    const processImage = (file) => {
        setStep(3);
        setIsProcessing(true);

        // Simulating "Nano Banana Pro" model processing
        setTimeout(() => {
            setIsProcessing(false);
            // In a real app, this would be the response from the AI model
            // For now, we'll just show the uploaded image as the "result" 
            // but normally this would be the tried-on image
            setResultImage(URL.createObjectURL(file));
            setStep(4);
        }, 3000); // 3 seconds simulation
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="wizard-step fade-in">
                        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Enter Order ID</h2>
                        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-light)' }}>
                            We need your Order ID to fetch your garment details.
                        </p>
                        <form onSubmit={handleOrderIdSubmit} className="input-group">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Order ID (e.g., #12345)"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                                Proceed
                            </button>
                        </form>
                    </div>
                );
            case 2:
                return (
                    <div className="wizard-step fade-in">
                        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Upload Your Photo</h2>
                        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-light)' }}>
                            Upload a full-body photo for the Virtual Try-On.
                        </p>
                        <div style={{ textAlign: 'center' }}>
                            <input
                                type="file"
                                accept="image/*"
                                id="ai-image-upload"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            <label
                                htmlFor="ai-image-upload"
                                className="btn btn-outline"
                                style={{ cursor: 'pointer', padding: '1rem 3rem' }}
                            >
                                📸 Select Photo
                            </label>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="wizard-step fade-in" style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Processing with AI...</h2>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'inline-block' }}>
                            <div className="loader" style={{
                                width: '50px',
                                height: '50px',
                                border: '3px solid rgba(212, 175, 55, 0.3)',
                                borderRadius: '50%',
                                borderTop: '3px solid var(--color-gold)',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 1.5rem auto'
                            }}></div>
                            <p style={{ color: 'var(--color-gold)', fontSize: '1.2rem' }}>Kingsman Pro Model</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>Analyzing garment structure...</p>
                        </div>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                );
            case 4:
                return (
                    <div className="wizard-step fade-in" style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Here is your Look!</h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--color-gold)' }}>Generated by Kingsman Pro</p>

                        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                            {resultImage && (
                                <img
                                    src={resultImage}
                                    alt="AI Result"
                                    style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
                                />
                            )}
                        </div>

                        <div className="wizard-controls" style={{ justifyContent: 'center', gap: '1rem' }}>
                            <button onClick={() => navigate('/')} className="btn btn-outline">
                                Return Home
                            </button>
                            <button onClick={() => window.print()} className="btn btn-primary">
                                Download / Print
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="wizard-container">
            <div className="glass-panel wizard-card" style={{ padding: '3rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-light)',
                        cursor: 'pointer',
                        fontSize: '1.5rem'
                    }}
                >
                    &times;
                </button>
                {renderStep()}
            </div>
        </div>
    );
};

export default CheckWithAIPage;
