import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Construction } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl md:text-3xl">
          <Settings className="mr-3 h-8 w-8 text-primary" />
          Site Settings
        </CardTitle>
        <CardDescription>Manage general site settings and configurations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center bg-muted/30 p-8 rounded-lg">
          <Construction className="h-20 w-20 text-primary mb-6" />
          <h2 className="text-2xl font-semibold mb-2">Settings Page - Under Construction</h2>
          <p className="text-muted-foreground max-w-md">
            This section is currently under development. Advanced site settings and customization options will be available here soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
