import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { tempService } from '../services';
import { toast } from 'react-hot-toast';
import LoadingContainer from '../components/common/LoadingContainer';

const Items = () => {
    const [temps, setTemps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    // Fetch all temps
    const fetchTemps = async () => {
        try {
            setLoading(true);
            const response = await tempService.getAll();
            setTemps(response.data || []);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error(error.message || 'Failed to fetch items');
            setTemps([]);
        } finally {
            setLoading(false);
        }
    };

    // Create new temp
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await tempService.create(formData);
            setTemps(prevTemps => [...prevTemps, response.data]);
            setFormData({ title: '', description: '' });
            toast.success('Item created successfully');
        } catch (error) {
            console.error('Create error:', error);
            toast.error(error.message || 'Failed to create item');
        }
    };

    // Delete temp
    const handleDelete = async (id) => {
        try {
            await tempService.delete(id);
            setTemps(prevTemps => prevTemps.filter(temp => temp._id !== id));
            toast.success('Item deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Failed to delete item');
        }
    };

    // Load temps on component mount
    useEffect(() => {
        fetchTemps();
    }, []);

    return (
        <>
            <Helmet>
                <title>Items | People Voice</title>
                <meta name="description" content="Manage and view items in People Voice - Create, update, and delete items" />
            </Helmet>

            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Manage Items</h1>
                
                {/* Create Form */}
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="border p-2 rounded flex-1"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="border p-2 rounded flex-1"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                            disabled={!formData.title.trim()}
                        >
                            Add Item
                        </button>
                    </div>
                </form>

                {/* Items List */}
                {loading ? (
                    <LoadingContainer text="Loading items..." />
                ) : (
                    <div className="space-y-4">
                        {temps.length === 0 ? (
                            <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-md">
                                No items found. Create one above!
                            </div>
                        ) : (
                            temps.map((temp) => (
                                <div
                                    key={temp._id}
                                    className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow"
                                >
                                    <div>
                                        <h3 className="font-bold text-lg">{temp.title}</h3>
                                        {temp.description && (
                                            <p className="text-gray-600 mt-1">{temp.description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(temp._id)}
                                        className="text-red-500 hover:text-red-700 px-4 py-2 rounded hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Items; 