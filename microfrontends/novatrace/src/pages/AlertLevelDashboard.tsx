import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "@novatrace/types/Alert";
import { Navbar } from "@novatrace/components/Navbar";
import { DashboardHeader } from "@novatrace/components/DashboardHeader";

import { AlertsList } from "@novatrace/components/AlertsList";
import { AlertDetails } from "@novatrace/components/AlertDetails";
import { AlertModal } from "@novatrace/components/AlertModal";
import { RawDataModal } from "@novatrace/components/RawDataModal";
import { SearchFilters, SearchFilters as SearchFiltersType } from "@novatrace/components/SearchFilters";
import { API_ENDPOINTS } from "@shared/lib/config";
import { ErrorComponent } from "@shared/components";
import {
  DashboardContainer,
  ErrorContainer,
  MainContent
} from "../styled_components/AlertLevelDashboard.styled";

// Global declarations for JS9
declare global {
  interface Window {
    JS9: any;
    fabric: any;
  }
}

export default function AlertsLevel() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAlert, setModalAlert] = useState<Alert | undefined>();
  const [isRawDataModalOpen, setIsRawDataModalOpen] = useState(false);
  const [rawDataAlert, setRawDataAlert] = useState<Alert | undefined>();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [js9Loaded, setJs9Loaded] = useState(false);
  const [apiError, setApiError] = useState<any>(null);

  // Load JS9 library when dashboard loads
  useEffect(() => {
    const loadJS9 = async () => {
      if (window.JS9) {
        setJs9Loaded(true);
        return;
      }

      try {
        // Load Fabric.js from CDN first
        await new Promise<void>((resolve, reject) => {
          const fabricScript = document.createElement('script');
          fabricScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
          fabricScript.onload = () => resolve();
          fabricScript.onerror = () => reject(new Error('Failed to load Fabric.js'));
          document.head.appendChild(fabricScript);
        });

        // Load JS9 script
        await new Promise<void>((resolve, reject) => {
          const js9Script = document.createElement('script');
          js9Script.src = 'https://js9.si.edu/js9/js9.js';
          js9Script.onload = () => resolve();
          js9Script.onerror = () => reject(new Error('Failed to load JS9'));
          document.head.appendChild(js9Script);
        });

        // Load JS9 CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://js9.si.edu/js9/js9.css';
        document.head.appendChild(link);

        // Wait a bit for everything to initialize
        setTimeout(() => {
          setJs9Loaded(true);
          console.log('JS9 library loaded successfully');
        }, 500);

      } catch (error) {
        console.error('Failed to load JS9 library:', error);
        // Try alternative approach - load JS9 without Fabric.js dependency
        try {
          console.log('Attempting to load JS9 without Fabric.js dependency...');
          await new Promise<void>((resolve, reject) => {
            const js9Script = document.createElement('script');
            js9Script.src = 'https://js9.si.edu/js9/js9.js';
            js9Script.onload = () => resolve();
            js9Script.onerror = () => reject(new Error('Failed to load JS9'));
            document.head.appendChild(js9Script);
          });

          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://js9.si.edu/js9/js9.css';
          document.head.appendChild(link);

          setTimeout(() => {
            setJs9Loaded(true);
            console.log('JS9 library loaded successfully (without Fabric.js)');
          }, 500);
        } catch (fallbackError) {
          console.error('Failed to load JS9 even with fallback approach:', fallbackError);
        }
      }
    };

    loadJS9();
  }, []);

  // Fetch alerts from API
  const { data: alerts = [], isLoading: isAlertsLoading, error: alertsError} = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: () => fetch(`${API_ENDPOINTS.alerts}`).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    }),
    refetchInterval: 15000, // Refresh every 15 seconds
    enabled: !isSearchMode,
  });

  // Fetch search results
  const { data: searchResults = {alerts: []}, isLoading: isSearchLoading, error: searchError } = useQuery({
    queryKey: ['/api/alerts/search', JSON.stringify(searchFilters), currentPage],
    queryFn: async () => {
      if (!searchFilters) return [];
      
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      params.append('limit', '20');
      params.append('offset', String((currentPage - 1) * 20));
      
      const response = await fetch(`${API_ENDPOINTS.alerts}/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: isSearchMode && !!searchFilters,
    staleTime: 60000,
  });
  useEffect(() => {
    if (alertsError) {
      setApiError(alertsError);
    }
  }, [alertsError]);
  useEffect(() => {
    if (searchError) {
      setApiError(searchError);
    }
  }, [searchError]);

  // Use search results when in search mode, otherwise use regular alerts
  const displayAlerts = isSearchMode ? searchResults.alerts : alerts;

  // Set the first alert as selected by default
  useEffect(() => {
    if (displayAlerts.length > 0 && !selectedAlert) {
      setSelectedAlert(displayAlerts[0]);
    }
  }, [JSON.stringify(displayAlerts), selectedAlert]);

  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
  
  };


  const handleOpenRawDataModal = (alert: Alert) => {
    console.log("Opening Raw Data Modal for alert:", alert.alertKey);
    setRawDataAlert(alert);
    setIsRawDataModalOpen(true);
  };

  const handleOpenAlertModal = (alert: Alert) => {
    console.log("Opening Alert Modal for alert:", alert.alertKey);
    setModalAlert(alert);
    setIsModalOpen(true);
  };

  const handleSearch = (filters: SearchFiltersType) => {
    setSearchFilters(filters);
    setIsSearchMode(true);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedAlert(undefined); // Clear selected alert when searching
  };

  const handleResetFilters = () => {
    setSearchFilters(undefined);
    setIsSearchMode(false);
    setCurrentPage(1); // Reset to first page when resetting
    setSelectedAlert(undefined); // Clear selected alert when resetting
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedAlert(undefined); // Clear selected alert when changing pages
  };

  return (
    <DashboardContainer>
      <Navbar />
      
      {/* Dashboard Header with Info and Trending */}
      <DashboardHeader onAlertClick={handleOpenAlertModal} />
      
      {/* Search Filters */}
      <SearchFilters 
        onSearch={handleSearch}
        onReset={handleResetFilters}
        isLoading={isSearchLoading}
      />
      
      {/* Main Content */}
      {apiError ? (
        <ErrorContainer>
          <ErrorComponent
            onRetry={() => {
              setApiError(null);
              // Trigger refetch by updating a state that affects the query
              setCurrentPage(currentPage);
            }}
          />
        </ErrorContainer>
      ) : (
        <MainContent>
          {/* Recent Alerts on Left */}
          <AlertsList 
            alerts={displayAlerts}
            onSelectAlert={handleSelectAlert}
            selectedAlert={selectedAlert}
            isSearchMode={isSearchMode}
            total={searchResults.total}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={20}
            isLoading={isSearchMode ? isSearchLoading : isAlertsLoading}
          />
          
          {/* Alert Details on Right */}
          <AlertDetails 
            selectedAlert={selectedAlert} 
            onOpenRawData={handleOpenRawDataModal}
            onOpenAlertModal={handleOpenAlertModal}
            js9Loaded={js9Loaded}
          />
        </MainContent>
      )}
      <AlertModal 
        alert={modalAlert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpenRawDataModal={handleOpenRawDataModal}
        
      />
      
      <RawDataModal 
        alert={rawDataAlert}
        isOpen={isRawDataModalOpen}
        onClose={() => setIsRawDataModalOpen(false)}
      />
    </DashboardContainer>
  );
}
