import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const ApplicationStatus = () => {
    const { getToken } = useAuth();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplication();
    }, []);

    const fetchApplication = async () => {
        try {
            const token = await getToken();
            const response = await fetch('http://localhost:5000/api/applications/my-application', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            setApplication(data.application);
        } catch (error) {
            console.error('Error fetching application:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!application) return null;

    const statusConfig = {
        PENDING: {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: '⏳',
            message: 'Your application is under review'
        },
        APPROVED: {
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: '✅',
            message: 'Congratulations! You are now a team member'
        },
        REJECTED: {
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: '❌',
            message: 'Your application was not approved'
        }
    };

    const config = statusConfig[application.status];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                📋 Application Status
            </h3>

            <div className={`${config.color} border rounded-lg p-4 mb-4`}>
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{config.icon}</span>
                    <span className="font-semibold text-lg">{application.status}</span>
                </div>
                <p className="text-sm">{config.message}</p>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600 text-sm">Desired Role:</span>
                    <span className="font-medium">{application.desiredRole}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600 text-sm">Domain:</span>
                    <span className="font-medium">{application.domain}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600 text-sm">Year:</span>
                    <span className="font-medium">{application.year}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600 text-sm">Submitted:</span>
                    <span className="font-medium">
                        {new Date(application.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {application.reviewedAt && (
                    <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-gray-600 text-sm">Reviewed:</span>
                        <span className="font-medium">
                            {new Date(application.reviewedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                )}

                {application.adminNotes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">💬 Admin Feedback:</p>
                        <p className="text-sm text-gray-600">{application.adminNotes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationStatus;
