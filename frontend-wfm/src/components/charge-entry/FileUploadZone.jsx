import React from 'react';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FileUploadZone = () => {
    const { toast } = useToast();

    const handleClick = () => {
        toast({
            title: "🚧 File Upload",
            description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    };

    return (
        <div 
            onClick={handleClick}
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-600/70 p-12 text-center hover:border-brand-green/70 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 cursor-pointer bg-gray-900/50"
        >
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-semibold text-white">Upload PDF Superbills</span>
            <p className="mt-1 block text-sm text-gray-400">Drag and drop files here, or click to select files.</p>
        </div>
    );
};

export default FileUploadZone;