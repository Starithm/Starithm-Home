import { Alert } from "@shared/types";
import { Button } from "@shared/components/ui/button";

import { X, FileText } from "lucide-react";
import React from "react";
import {
  Overlay,
  Modal,
  HeaderRow,
  TitleRow,
  Body,
  Meta,
  MetaTitle,
  MetaText,
  CodeWrapper,
  Pre,
} from "../styled_components/RawDataModal.styled";

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
      <Overlay onClick={onClose} />
      <Modal>
        <HeaderRow>
          <TitleRow>
            <FileText className="h-5 w-5" />
            <span>Raw Alert Data - {alert.alertKey}</span>
          </TitleRow>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </HeaderRow>
        
        <Body>
          <Meta>
            <MetaTitle>{alert.event}</MetaTitle>
            <MetaText>{alert.alertKey}</MetaText>
            <MetaText>{new Date(alert.date).toLocaleString()}</MetaText>
          </Meta>
          
          <CodeWrapper>
            <Pre>
              {alert.data.raw}
            </Pre>
          </CodeWrapper>
        </Body>
      </Modal>
    </>
  );
}
