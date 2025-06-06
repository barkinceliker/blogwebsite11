
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getCvInfo, uploadCv, deleteCv } from '@/lib/actions/adminActions';
import type { CvInfo } from '@/types';
import { FileArchive, UploadCloud, Trash2, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminCvPage() {
  const { toast } = useToast();
  const [cvInfo, setCvInfo] = useState<CvInfo | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchCvData = () => {
    startTransition(async () => {
      setIsLoading(true);
      try {
        const data = await getCvInfo();
        setCvInfo(data);
        if (data.error) {
            toast({ title: "Error fetching CV info", description: data.error, variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch CV information.", variant: "destructive" });
      }
      setIsLoading(false);
    });
  };
  
  useEffect(() => {
    fetchCvData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type !== 'application/pdf') {
        toast({ title: "Invalid File Type", description: "Please select a PDF file.", variant: "destructive" });
        setSelectedFile(null);
        event.target.value = ""; // Reset file input
        return;
      }
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: "No File Selected", description: "Please select a PDF file to upload.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('cvFile', selectedFile);

    const result = await uploadCv(formData);
    if (result.success) {
      toast({ title: "CV Uploaded", description: "Your CV has been successfully uploaded." });
      fetchCvData(); // Refresh CV info
      setSelectedFile(null); 
      const fileInput = document.getElementById('cvFile') as HTMLInputElement;
      if (fileInput) fileInput.value = ""; // Reset file input
    } else {
      toast({ title: "Upload Failed", description: result.error || "Could not upload CV.", variant: "destructive" });
    }
    setIsUploading(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCv();
    if (result.success) {
      toast({ title: "CV Deleted", description: "Your CV has been successfully deleted." });
      fetchCvData(); // Refresh CV info
    } else {
      toast({ title: "Delete Failed", description: result.error || "Could not delete CV.", variant: "destructive" });
    }
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center text-2xl md:text-3xl">
            <FileArchive className="mr-3 h-8 w-8 text-primary" />
            Manage CV
          </CardTitle>
          <CardDescription>Upload, view, or delete your CV (PDF format only).</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchCvData} disabled={isPending || isLoading}>
            <RefreshCw className={`h-5 w-5 ${isPending || isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">Current CV Status</CardTitle>
          </CardHeader>
          <CardContent>
            {cvInfo?.exists && cvInfo.filename && cvInfo.downloadUrl ? (
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Filename:</span> {cvInfo.filename}
                </p>
                <div className="flex space-x-3 items-center">
                  <Button asChild>
                    <a href={cvInfo.downloadUrl} download={cvInfo.filename}>
                      <Download className="mr-2 h-4 w-4" /> Download CV
                    </a>
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete CV
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                No CV currently uploaded.
              </p>
            )}
             {cvInfo?.error && !cvInfo.exists && (
                 <p className="text-destructive text-sm mt-2">
                    Error checking CV: {cvInfo.error}. This might be a server-side issue or file system permission problem.
                 </p>
             )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Upload New CV</CardTitle>
            <CardDescription>Select a PDF file to upload. This will replace the current CV if one exists.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cvFile" className="text-base">Select PDF File</Label>
              <Input id="cvFile" type="file" accept=".pdf" onChange={handleFileChange} className="mt-1" />
              {selectedFile && <p className="text-sm text-muted-foreground mt-1">Selected: {selectedFile.name}</p>}
            </div>
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading} size="lg">
              {isUploading ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <UploadCloud className="mr-2 h-5 w-5" />}
              {isUploading ? 'Uploading...' : 'Upload CV'}
            </Button>
          </CardContent>
        </Card>
        
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md">
          <h4 className="font-bold">Important Note:</h4>
          <p className="text-sm">
            CV uploads are saved to the server's `public` folder. This works for local development.
            For production deployment on serverless platforms (like Firebase Hosting), this file upload method may not be persistent.
            The CV might need to be included in the project build or a cloud storage solution (like Firebase Storage) should be used.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}
