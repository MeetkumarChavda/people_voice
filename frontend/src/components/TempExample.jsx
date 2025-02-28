import { useState, useEffect } from 'react';
import { tempService } from '../services';
import { toast } from 'react-hot-toast';

const TempExample = () => {
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

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl">Loading...</div>
        </div>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Temp Items</h1>
            
            {/* Create Form */}
            <form onSubmit={handleSubmit} className="mb-6">
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
            <div className="space-y-4">
                {temps.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No items found. Create one above!
                    </div>
                ) : (
                    temps.map((temp) => (
                        <div
                            key={temp._id}
                            className="border p-4 rounded flex justify-between items-center hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h3 className="font-bold">{temp.title}</h3>
                                {temp.description && (
                                    <p className="text-gray-600">{temp.description}</p>
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
        </div>
    );
};

export default TempExample; 