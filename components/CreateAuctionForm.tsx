import React, { useState } from 'react';

interface GeneratedData {
    title: string;
    description: string;
    startingPrice: number;
    imageUrl: string;
}

interface CreateAuctionFormProps {
    onCreateAuction: (data: Omit<GeneratedData, 'imageUrl'> & { imageUrl: string, endTime: Date }) => void;
    onGenerate: (prompt: string) => Promise<GeneratedData | null>;
    isGenerating: boolean;
    onClose: () => void;
}

const CreateAuctionForm: React.FC<CreateAuctionFormProps> = ({ onCreateAuction, onGenerate, isGenerating, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('30');
    const [imageUrl, setImageUrl] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');

    const handleGenerate = async () => {
        if (!aiPrompt) return;
        const result = await onGenerate(aiPrompt);
        if (result) {
            setTitle(result.title);
            setDescription(result.description);
            setStartingPrice(String(result.startingPrice));
            const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(result.title)}`;
            setImageUrl(unsplashUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const endTime = new Date(Date.now() + Number(durationMinutes) * 60 * 1000);
        const finalImageUrl = imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(title)}`;

        onCreateAuction({
            title,
            description,
            startingPrice: Number(startingPrice),
            endTime,
            imageUrl: finalImageUrl,
        });
        onClose();
    };

    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">Generate with AI</h4>
                <div className="flex mt-2 space-x-2">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., a vintage sci-fi movie poster"
                        className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        disabled={isGenerating}
                    />
                    <button
                        onClick={handleGenerate}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-purple-400"
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Generating...' : '✨ Generate'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Starting Price ($)</label>
                        <input type="number" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} required min="1" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Duration (minutes)</label>
                        <input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} required min="5" max="45" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Image URL (Optional)</label>
                    <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Leave blank for a relevant image" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-md">Cancel</button>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Create Auction</button>
                </div>
            </form>
        </div>
    );
};

export default CreateAuctionForm;