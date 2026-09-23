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
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}60 transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}50;
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}90;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

export const AlertDetailsInner = styled.div`
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
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
  gap: var(--space-3);
`;

export const AlertIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')};
`;

export const AlertTitleSection = styled.div``;

export const AlertTitle = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const AlertSubtitle = styled.p`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const AlertHeaderRight = styled.div`
  display: flex;
  aligntItems: center;
  gap: var(--space-2);
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
  margin: 0 auto var(--space-4);
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-2);
`;

export const EmptyStateDescription = styled.p`
  font-size: var(--font-size-sm);
`;

// Card sections
export const CardSection = styled.div`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const AlertCardHeader = styled(CardHeader)`
  padding: var(--space-4);
`;

export const StyledCardTitle = styled.h3`
  display: flex;
  aligntItems: center;
  gap: var(--space-2);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const CardIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const StyledCardContent = styled.div`
  padding: var(--space-4);
  border-radius: 0.5rem;
  margin-bottom: var(--space-4);
`;

// Event information grid
export const EventInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
`;

export const EventInfoItem = styled.div``;

export const EventInfoLabel = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const EventInfoValue = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

// Summary section
export const SummaryCard = styled.div`
  border: 1px solid #ffc332;
  background: linear-gradient(90deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')}0D 0%, 
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}0D 50%, 
    #2f0240 100%
  );
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const SummaryFooter = styled.p`
  font-size: var(--font-size-xs);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  text-align: right;
  font-style: italic;
  margin-top: var(--space-2);
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
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}60 transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}50;
    border-radius: 9999px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'border', '#e5e7eb')}90;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

export const TimelineItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
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
      ? getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')
      : getThemeValue(theme, 'border', '#686868')
  };
`;

export const TimelineCard = styled.div`
  margin-left: 2rem;
  flex: 1;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', '#f9fafb')};
  border-radius: 0.5rem;
  padding: var(--space-3);
  transition: background-color var(--transition-normal);
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  }
`;

export const TimelineCardHeader = styled.div`
  display: flex;
  alignt-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  background-color: ${({ theme }) => getThemeValue(theme, 'background', '#0E0B16')};
`;

export const TimelineCardLeft = styled.div`
  display: flex;
  alignt-items: center;
  gap: var(--space-2);
`;

export const TimelineCardRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const TimelineStatusDot = styled.div<{ isCurrent: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ isCurrent, theme }) => isCurrent ? getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5') : getThemeValue(theme, 'starithmVeronica', '#A239CA')};
`;

export const TimelineCardContent = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#374151')};
  margin-bottom: var(--space-2);
`;

export const TimelineCardFooter = styled.p`
  font-size: var(--font-size-xs);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const TimelineEmptyState = styled.div`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
    margin-left: 2rem;
`;

// Measurements section
export const MeasurementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
`;

export const MeasurementItem = styled.div``;

export const MeasurementLabel = styled.label`
  font-size: var(--font-size-sm);
  fontWeight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const MeasurementValue = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const MeasurementTable = styled.div`
  marginTop: var(--space-4);
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const MeasurementTableHeader = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}80;
  padding: var(--space-4) var(--space-2);
  borderBottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const MeasurementTableTitle = styled.h4`
  fontWeight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
`;

export const MeasurementTableContent = styled.div`
  overflowX: auto;
  marginTop: var(--space-4);
`;

export const MeasurementTableElement = styled.table`
  width: 100%;
  font-size: var(--font-size-sm);
`;

export const MeasurementTableHead = styled.thead`
  background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}4D;
`;

export const MeasurementTableHeaderCell = styled.th`
  padding: var(--space-4) var(--space-2);
  text-align: left;
  font-weight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const MeasurementTableBody = styled.tbody``;

export const MeasurementTableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  transition: background-color var(--transition-normal);

  &:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}33;
  }
`;

export const MeasurementTableCell = styled.td`
  padding: var(--space-4) var(--space-2);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const MeasurementEmptyState = styled.div`
  padding: var(--space-4);
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

// Participants section
export const ParticipantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  margin-left: var(--space-4);
  margin-right: var(--space-4);
  margin-bottom: var(--space-4);
`;

export const ParticipantColumn = styled.div``;

export const ParticipantItem = styled.div`
  margin-bottom: var(--space-3);
`;

export const ParticipantLabel = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const ParticipantValue = styled.div`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  margin-top: var(--space-1);
`;

// Images section
export const AlertImagesSection = styled(Card)`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'gray.200', '#e5e7eb')};
`;

export const AlertImagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
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
  transition: opacity var(--transition-normal);

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
  transition: all var(--transition-normal);
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
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const FitsFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3);
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  transition: background-color var(--transition-normal);

  &:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'gray.50', '#f9fafb')};
  }
`;

export const FitsFileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const FitsFileIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')};
`;

export const FitsFileName = styled.span`
  font-size: var(--font-size-sm);
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
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

export const LinkItem = styled.a`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'starithmLink', '#3b82f6')};
  text-decoration: none;
  transition: text-decoration var(--transition-normal);

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
  padding: var(--space-4);
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const ImageModalHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ImageModalTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
`;

export const ImageModalBody = styled.div`
  padding: var(--space-4);
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
  gap: var(--space-2);
`;

export const AlertCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  border-radius: 0.5rem;
  margin-bottom: var(--space-4);
  margin-left: var(--space-4);
  margin-right: var(--space-4);
`;

export const AlertParticipantsValue = styled.div`
  font-size: var(--font-size-sm);
  margin-top: var(--space-1);
`;

// Summary section with gradient background
export const AlertSummarySection = styled(Card)`
  border: 1px solid #ffc332;
  background: linear-gradient(90deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')}0D 0%, 
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}0D 50%, 
    #2f0240 100%
  );
  border-radius: 0.5rem;
`;

export const AlertSummaryContent = styled(CardContent)`
  border-radius: 0.5rem;
  margin-left: var(--space-4);
  margin-right: var(--space-4);
  margin-bottom: var(--space-4);

`;

export const AlertSummaryText = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const AlertSummaryFooter = styled.p`
  font-size: var(--font-size-xs);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  text-align: right;
  font-style: italic;
  margin-top: var(--space-2);
`;

export const AlertFitsFileName = styled.span`
  font-size: var(--font-size-sm);
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
  gap: var(--space-2);
`;

export const AlertFitsFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3);
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  transition: background-color var(--transition-normal);

  &:hover {
    background-color: ${({ theme }) => getThemeValue(theme, 'gray.50', '#f9fafb')};
  }
`;

export const AlertFitsFileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const AlertFitsFileIcon = styled.div`
  color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#8D0FF5')};
`;

export const AlertMeasurementLabel = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

export const AlertMeasurementValue = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
  margin-bottom: var(--space-4);
`;

export const AlertMeasurementItem = styled.div`
    margin-bottom: var(--space-4);
`;
export const AlertMeasurementGenericObject = styled.div`
    label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
    }
    p {
        font-size: var(--font-size-sm);
    }
`;

export const AlertNoMeasurementsMessage = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
`;

{/* <div className="mt-6">
                      <label className="text-sm font-medium text-muted-foreground mb-2">Tables</label>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-2 border-b">
                          <h4 className="font-medium text-sm">Data Table</h4>
                        </div> */}

export const AlertMeasurementTableSection = styled.div`
    margin-top: var(--space-6);
    label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
        margin-bottom: var(--space-2);
    }
`;
export const AlertMeasurementTableSectionContent= styled.div`
border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
    border-radius: 0.5rem;
    overflow: hidden;`;


export const AlertMeasurementTableSectionContentTitle = styled.div`
    padding: var(--space-4) var(--space-2);
    border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
    background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}50;
    h4 {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium); 
    }
`;
                        // Measurement table
export const AlertMeasurementCard = styled(Card)`
    border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
    padding: var(--space-4);
    CardTitle {
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }
    CardContent {
        border-radius: 0.5rem;

    }
`;
export const AlertMeasurementTable = styled.table`
  width: 100%;
  font-size: var(--font-size-sm);
  margin-top: var(--space-4);
`;
export const AlertMeasurementTableWrapper = styled.div`
    overflow-x: auto;
`;
export const AlertMeasurementGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);


`;
export const AlertMeasurementTableNoData = styled.p`
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  padding: var(--space-4);
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
  padding: var(--space-4) var(--space-2);
  text-align: left;
  font-weight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const AlertMeasurementTableBody = styled.tbody``;

export const AlertMeasurementTableCell = styled.td`
  padding: var(--space-4) var(--space-2);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

export const AlertMeasurementSectionTitle = styled.h4`
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  color: ${({ theme }) => getThemeValue(theme, 'foreground', '#0E0B16')};
`;

// Tables section
export const AlertTablesSection = styled.div`
  margin-top: var(--space-6);
`;

export const AlertTablesSectionLabel = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: ${({ theme }) => getThemeValue(theme, 'mutedForeground', '#686868')};
  margin-bottom: var(--space-2);
`;

export const AlertTablesSectionContainer = styled.div`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const AlertTablesSectionHeader = styled.div`
  background-color: ${({ theme }) => getThemeValue(theme, 'muted', '#f3f4f6')}80;
  padding: var(--space-4) var(--space-2);
  border-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
`;

export const AlertTablesSectionTitle = styled.h4`
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
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
        padding: var(--space-4);
        order-bottom: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
    }
    div{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    DialogTitle {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
    }
    Button {
        variant: outline;
        size: sm;
    }
`;
export const AlertImageModalImage = styled.img`
    padding: var(--space-4);
    img {
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 0.5rem;
    }
`;