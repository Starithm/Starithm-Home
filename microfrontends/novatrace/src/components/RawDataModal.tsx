import { Alert } from "@shared/types";
import { Button } from "@shared/components/ui/button";

import { Copy, X, FileText } from "lucide-react";
import React from "react";

interface RawDataModalProps {
  alert?: Alert;
  isOpen: boolean;
  onClose: () => void;
}

export function RawDataModal({ alert, isOpen, onClose }: RawDataModalProps) {

  console.log("RawDataModal render - isOpen:", isOpen, "alert:", alert?.alertKey);

  if (!alert) return null;
  console.log("raw data modal", alert);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      {/* <div className="fixed top-[50%] left-[50%] z-[9999] w-full max-w-4xl max-h-[80vh] bg-red-500 text-white border-4 border-yellow-400 rounded-lg p-6 transform -translate-x-1/2 -translate-y-1/2"> */}
      <div className="fixed top-[50%] left-[50%] z-[9999] w-full max-w-4xl max-h-[80vh] bg-background text-primary-foreground border-2 border-border rounded-lg p-6 transform -translate-x-1/2 -translate-y-1/2">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Raw Alert Data - {alert.alertKey}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{alert.event}</h3>
              <p className="text-sm">{alert.alertKey}</p>
              <p className="text-sm">{new Date(alert.date).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="border rounded-lg h-96 overflow-auto bg-white text-black">
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
      </div>
    </>
  );
}
