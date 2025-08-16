import { Alert } from "@/types/Alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, X, FileText } from "lucide-react";
import { useState } from "react";

interface RawDataModalProps {
  alert?: Alert;
  isOpen: boolean;
  onClose: () => void;
}

export function RawDataModal({ alert, isOpen, onClose }: RawDataModalProps) {

  if (!alert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Raw Alert Data - {alert.alertKey}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{alert.event}</h3>
              <p className="text-sm text-muted-foreground">{alert.alertKey}</p>
              <p className="text-sm text-muted-foreground">{new Date(alert.date).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="border rounded-lg h-96 overflow-auto">
            <pre 
              className="p-4 text-sm font-mono whitespace-pre-wrap max-w-full"
              style={{ 
                wordBreak: 'break-all',
                overflowWrap: 'anywhere',
                whiteSpace: 'pre-wrap'
              }}
            >
              {alert.data.raw}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
