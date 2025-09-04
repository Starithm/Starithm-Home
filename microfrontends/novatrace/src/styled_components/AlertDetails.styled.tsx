import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Dialog } from '@shared/components/ui/dialog';

// Main container
export const AlertDetailsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const AlertDetailsContent = styled.div`
  height: 100%;
  overflow-y: auto;
`;

export const AlertDetailsInner = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
`;

// Header section
export const AlertHeader = styled.div`
  display: flex;
  aligntItems: flex-start;
  justify-content: space-between;
`;


export const AlertHeaderLeft = styled.div`
  display: flex;
  aligntItems: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const AlertIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
`;

export const AlertTitleSection = styled.div``;

export const AlertTitle = styled.h1`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.2xl', '1.5rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.bold', 700)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const AlertSubtitle = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const AlertHeaderRight = styled.div`
  display: flex;
  aligntItems: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

// Empty state
export const EmptyStateContainer = styled.div`
  flex: 1;
  display: flex;
  aligntItems: center;
  justifyContent: center;
`;

export const EmptyStateContent = styled.div`
  textAlign: center;
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const EmptyStateIcon = styled.div`
  margin: 0 auto ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const EmptyStateDescription = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
`;

// Card sections
export const CardSection = styled.div`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const AlertCardHeader = styled(CardHeader)`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const StyledCardTitle = styled.h3`
  display: flex;
  aligntItems: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const CardIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const StyledCardContent = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  border-radius: 0.5rem;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

// Event information grid
export const EventInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const EventInfoItem = styled.div``;

export const EventInfoLabel = styled.label`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const EventInfoValue = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

// Summary section
export const SummaryCard = styled.div`
  border: 1px solid #ffc332;
  background: linear-gradient(90deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}0D 0%, 
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}0D 50%, 
    #2f0240 100%
  );
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const SummaryFooter = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  text-align: right;
  font-style: italic;
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

// Timeline section
export const TimelineContainer = styled.div`
  position: relative;
`;

export const TimelineLine = styled.div`
  position: absolute;
  left: 1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const TimelineScrollContainer = styled.div`
  max-height: 24rem;
  overflow-y: auto;
`;

export const TimelineItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const TimelineItem = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
`;

export const TimelineDot = styled.div<{ isCurrent: boolean }>`
  position: absolute;
  left: 0.75rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  background-color: ${({ isCurrent, theme }) => 
    isCurrent 
      ? getThemeValue(theme, 'starithmElectricViolet', '#770ff5')
      : getThemeValue(theme, 'border', '#686868')
  };
`;

export const TimelineCard = styled.div`
  margin-left: 2rem;
  flex: 1;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', '#f9fafb')};
  border-radius: 0.5rem;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
  transition: background-color ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  }
`;

export const TimelineCardHeader = styled.div`
  display: flex;
  alignt-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  background-color: ${({ theme }) => getThemeValue(theme, 'background', '#0E0B16')};
`;

export const TimelineCardLeft = styled.div`
  display: flex;
  alignt-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const TimelineCardRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const TimelineStatusDot = styled.div<{ isCurrent: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ isCurrent, theme }) => isCurrent ? getThemeValue(theme, 'starithmElectricViolet', '#770ff5') : getThemeValue(theme, 'starithmVeronica', '#A239CA')};
`;

export const TimelineCardContent = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#374151')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const TimelineCardFooter = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const TimelineEmptyState = styled.div`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
    margin-left: 2rem;
`;

// Measurements section
export const MeasurementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const MeasurementItem = styled.div``;

export const MeasurementLabel = styled.label`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  fontWeight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const MeasurementValue = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const MeasurementTable = styled.div`
  marginTop: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const MeasurementTableHeader = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}80;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')} ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  borderBottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const MeasurementTableTitle = styled.h4`
  fontWeight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
`;

export const MeasurementTableContent = styled.div`
  overflowX: auto;
  marginTop: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const MeasurementTableElement = styled.table`
  width: 100%;
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
`;

export const MeasurementTableHead = styled.thead`
  background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}4D;
`;

export const MeasurementTableHeaderCell = styled.th`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')} ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  text-align: left;
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const MeasurementTableBody = styled.tbody``;

export const MeasurementTableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  transition: background-color ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}33;
  }
`;

export const MeasurementTableCell = styled.td`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')} ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const MeasurementEmptyState = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

// Participants section
export const ParticipantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
  margin-left: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  margin-right: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const ParticipantColumn = styled.div``;

export const ParticipantItem = styled.div`
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
`;

export const ParticipantLabel = styled.label`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const ParticipantValue = styled.div`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')};
`;

// Images section
export const AlertImagesSection = styled(Card)`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'gray.200', '#e5e7eb')};
`;

export const AlertImagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const AlertImageItem = styled.div`
  position: relative;
  
  &:hover {
    .image-expand-button {
      opacity: 1;
    }
  }
`;

export const AlertImageElement = styled.img`
  width: 50%;
  height: 6.25rem;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  cursor: pointer;
  transition: opacity ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    opacity: 0.9;
  }
`;

export const AlertImageExpandButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.25rem;
  border-radius: 0.25rem;
  opacity: 0;
  transition: all ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};
  border: none;
  cursor: pointer;
  class-name: image-expand-button;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

// FITS files section
export const FitsFilesContainer = styled.div`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const FitsFilesContent = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const FitsFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  transition: background-color ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'gray.50', '#f9fafb')};
  }
`;

export const FitsFileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const FitsFileIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
`;

export const FitsFileName = styled.span`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-family: monospace;
  color: ${({ theme }) => getThemeValue(theme, 'gray.700', '#374151')};
`;

// Links section
export const LinksContainer = styled.div`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const LinksContent = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const LinkItem = styled.a`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'starithmLink', '#3b82f6')};
  text-decoration: none;
  transition: text-decoration ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    text-decoration: underline;
  }
`;

// Modal components
export const ImageModalContent = styled.div`
  max-width: 64rem;
  max-height: 90vh;
  padding: 0;
`;

export const ImageModalHeader = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const ImageModalHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ImageModalTitle = styled.h2`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
`;

export const ImageModalBody = styled.div`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const ImageModalImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 0.5rem;
`;

// Card wrappers for common patterns (using styled() with existing components)
export const AlertCardSection = styled(Card)`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
`;

export const AlertCardTitle = styled(CardTitle)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const AlertCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  border-radius: 0.5rem;
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  margin-left: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  margin-right: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const AlertParticipantsValue = styled.div`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.1', '0.25rem')};
`;

// Summary section with gradient background
export const AlertSummarySection = styled(Card)`
  border: 1px solid #ffc332;
  background: linear-gradient(90deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}0D 0%, 
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}0D 50%, 
    #2f0240 100%
  );
  border-radius: 0.5rem;
`;

export const AlertSummaryContent = styled(CardContent)`
  border-radius: 0.5rem;
  margin-left: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  margin-right: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};

`;

export const AlertSummaryText = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const AlertSummaryFooter = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.xs', '0.75rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  text-align: right;
  font-style: italic;
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const AlertFitsFileName = styled.span`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-family: monospace;
  color: ${({ theme }) => getThemeValue(theme, 'gray.700', '#374151')};
`;

// FITS Files section
export const AlertFitsSection = styled(Card)`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'gray.200', '#e5e7eb')};
`;

export const AlertFitsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const AlertFitsFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.3', '0.75rem')};
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  transition: background-color ${({ theme }) => getThemeValue(theme, 'transitions.normal', '0.3s ease')};

  &:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'gray.50', '#f9fafb')};
  }
`;

export const AlertFitsFileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const AlertFitsFileIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')};
`;

export const AlertMeasurementLabel = styled.label`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const AlertMeasurementValue = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;

export const AlertMeasurementItem = styled.div`
    margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;
export const AlertMeasurementGenericObject = styled.div`
    label {
        font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
        font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
        color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
    }
    p {
        font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
    }
`;

export const AlertNoMeasurementsMessage = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

{/* <div className="mt-6">
                      <label className="text-sm font-medium text-muted-foreground mb-2">Tables</label>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-2 border-b">
                          <h4 className="font-medium text-sm">Data Table</h4>
                        </div> */}

export const AlertMeasurementTableSection = styled.div`
    margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
    label {
        font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
        font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
        color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
        margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
    }
`;
export const AlertMeasurementTableSectionContent= styled.div`
border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
    border-radius: 0.5rem;
    overflow: hidden;`;


export const AlertMeasurementTableSectionContentTitle = styled.div`
    padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')} ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
    border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
    background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}50;
    h4 {
        font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
        font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)}; 
    }
`;
                        // Measurement table
export const AlertMeasurementCard = styled(Card)`
    border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
    padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
    CardTitle {
        display: flex;
        align-items: center;
        gap: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
    }
    CardContent {
        border-radius: 0.5rem;

    }
`;
export const AlertMeasurementTable = styled.table`
  width: 100%;
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;
export const AlertMeasurementTableWrapper = styled.div`
    overflow-x: auto;
`;
export const AlertMeasurementGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};


`;
export const AlertMeasurementTableNoData = styled.p`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
`;
export const AlertMeasurementTableHead = styled.thead`
  background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}4D;
`;

export const AlertMeasurementTableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  
  &:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}33;
  }
`;

export const AlertMeasurementTableHeaderCell = styled.th`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')} ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  text-align: left;
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const AlertMeasurementTableBody = styled.tbody``;

export const AlertMeasurementTableCell = styled.td`
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')} ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const AlertMeasurementSectionTitle = styled.h4`
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

// Tables section
export const AlertTablesSection = styled.div`
  margin-top: ${({ theme }) => getThemeValue(theme, 'spacing.6', '1.5rem')};
`;

export const AlertTablesSectionLabel = styled.label`
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  margin-bottom: ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
`;

export const AlertTablesSectionContainer = styled.div`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const AlertTablesSectionHeader = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}80;
  padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')} ${({ theme }) => getThemeValue(theme, 'spacing.2', '0.5rem')};
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const AlertTablesSectionTitle = styled.h4`
  font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.medium', 500)};
  font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.sm', '0.875rem')};
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

{/* <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <DialogHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-semibold">Image Preview</DialogTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsImageModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogHeader>
              <div className="p-4">
                <img
                  src={selectedImage}
                  alt="Full size image"
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog> */}
export const AlertImageModal = styled(Dialog)`
    DialogContent {
        max-width: 4rem;
        max-height: 90vh;
        padding: 0;
    }
    DialogHeader {
        padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
        order-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
    }
    div{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    DialogTitle {
        font-size: ${({ theme }) => getThemeValue(theme, 'fontSize.lg', '1.125rem')};
        font-weight: ${({ theme }) => getThemeValue(theme, 'fontWeight.semibold', 600)};
    }
    Button {
        variant: outline;
        size: sm;
    }
`;
export const AlertImageModalImage = styled.img`
    padding: ${({ theme }) => getThemeValue(theme, 'spacing.4', '1rem')};
    img {
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 0.5rem;
    }
`;