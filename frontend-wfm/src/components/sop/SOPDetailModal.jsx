import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const SOPDetailModal = ({ isOpen, onClose, sop, onSave, clients, sows }) => {
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [sow, setSow] = useState('');
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        if (sop) {
            setTitle(sop.title);
            setClient(sop.client);
            setSow(sop.sow);
            setContent(sop.content || '');
            setAttachments(sop.attachments || []);
        } else {
            setTitle('');
            setClient('');
            setSow('');
            setContent('');
            setAttachments([]);
        }
    }, [sop, isOpen]);

    const handleSave = () => {
        if (!title || !client || !sow || !content) {
            toast({
                title: 'Validation Error',
                description: 'Please fill out all required fields.',
                variant: 'destructive',
            });
            return;
        }
        onSave({ id: sop?.id, title, client, sow, content, attachments });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAttachments([...attachments, file.name]);
            toast({
                title: "File Uploaded (Simulated)",
                description: `${file.name} has been added to the attachments.`,
                className: "bg-blue-500 text-white"
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-glass-dark border-[#39ff14]/30 text-white sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{sop ? 'Edit SOP' : 'Create New SOP'}</DialogTitle>
                    <DialogDescription>
                        {sop ? `Editing "${sop.title}" (v${sop.version})` : 'Fill in the details for the new SOP.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">SOP Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="bg-black/20 border-[#39ff14]/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="client-select">Client</Label>
                            <Select value={client} onValueChange={setClient}>
                                <SelectTrigger id="client-select" className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Select client..." /></SelectTrigger>
                                <SelectContent>{clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sow-select">SOW</Label>
                            <Select value={sow} onValueChange={setSow}>
                                <SelectTrigger id="sow-select" className="bg-black/20 border-[#39ff14]/30"><SelectValue placeholder="Select SOW..." /></SelectTrigger>
                                <SelectContent>{sows.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">SOP Content (Markdown supported)</Label>
                        <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} className="bg-black/30 border-[#39ff14]/20 min-h-[200px]" placeholder="Enter SOP rules and procedures..."/>
                    </div>
                     <div className="space-y-2">
                        <Label>Attachments</Label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {attachments.map((file, index) => <Badge key={index} variant="secondary">{file}</Badge>)}
                        </div>
                        <Button asChild variant="outline" className="w-full border-dashed border-[#39ff14]/50 hover:bg-[#39ff14]/10">
                           <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center">
                                <Upload className="mr-2 h-4 w-4" /> Upload File
                                <input id="file-upload" type="file" className="sr-only" onChange={handleFileUpload}/>
                           </label>
                        </Button>
                    </div>
                </div>
                <DialogFooter className="flex-row justify-end gap-2 pt-4 border-t border-[#39ff14]/20">
                    <Button variant="outline" onClick={onClose} className="border-gray-500/50 text-gray-300 hover:bg-gray-500/20 hover:text-white">
                        <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90">
                        <Save className="mr-2 h-4 w-4" /> Save SOP
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SOPDetailModal;