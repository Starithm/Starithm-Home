import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from './ui/button';
import {
  NotFoundContainer,
  NotFoundContent,
  NotFoundIconContainer,
  NotFoundIcon,
  NotFoundTitle,
  NotFoundDescription,
  NotFoundBackLink
} from '../styled_components/NotFound.styled';

interface NotFoundProps {
  title?: string;
  description?: string;
  backLinkText?: string;
  backLinkPath?: string;
  icon?: React.ReactNode;
}

export function NotFound({ 
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist.",
  backLinkText = "Go Back",
  backLinkPath = "/",
  icon
}: NotFoundProps) {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundIconContainer>
          <NotFoundIcon>
            {icon || <FileText size={96} />}
          </NotFoundIcon>
          <NotFoundTitle>{title}</NotFoundTitle>
          <NotFoundDescription>
            {description}
          </NotFoundDescription>
        </NotFoundIconContainer>
        
        <Button asChild>
          <NotFoundBackLink to={backLinkPath}>
            <ArrowLeft size={16} />
            <span>{backLinkText}</span>
          </NotFoundBackLink>
        </Button>
      </NotFoundContent>
    </NotFoundContainer>
  );
}
