import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Alert } from "@/types/Alert";
import { Navbar } from "@/components/event-intelligence/Navbar";
import { DashboardHeader } from "@/components/event-intelligence/DashboardHeader";

import { AlertsList } from "@/components/event-intelligence/AlertsList";
import { AlertDetails } from "@/components/event-intelligence/AlertDetails";
import { AlertModal } from "@/components/event-intelligence/AlertModal";
import { RawDataModal } from "@/components/event-intelligence/RawDataModal";
import { SearchFilters, SearchFilters as SearchFiltersType } from "@/components/event-intelligence/SearchFilters";
import { API_ENDPOINTS } from "@/lib/config";

export default function EventIntelligence() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAlert, setModalAlert] = useState<Alert | undefined>();
  const [isRawDataModalOpen, setIsRawDataModalOpen] = useState(false);
  const [rawDataAlert, setRawDataAlert] = useState<Alert | undefined>();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch alerts from API
  const { data: alerts = [] } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: () => fetch(`${API_ENDPOINTS.alerts}`).then(res => res.json()),
    refetchInterval: 15000, // Refresh every 15 seconds
    enabled: !isSearchMode,
  });

  // Fetch search results
  const { data: searchResults = {alerts: []}, isLoading: isSearchLoading } = useQuery({
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
      console.log("searcgparams", params.toString());
      
      const response = await fetch(`${API_ENDPOINTS.alerts}/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      return response.json();
    },
    enabled: isSearchMode && !!searchFilters,
    staleTime: 60000, // Consider data fresh for 1 minute
  });

  // Use search results when in search mode, otherwise use regular alerts
  const displayAlerts = isSearchMode ? searchResults.alerts : alerts;

  // Set the first alert as selected by default
  useEffect(() => {
    if (alerts.length > 0 && !selectedAlert) {
      setSelectedAlert(alerts[0]);
    }
  }, [alerts, selectedAlert]);

  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
  
  };


  const handleOpenRawDataModal = (alert: Alert) => {
    setRawDataAlert(alert);
    setIsRawDataModalOpen(true);
  };

  const handleOpenAlertModal = (alert: Alert) => {
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
    <div className="min-h-screen bg-background text-foreground">
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
      <div className="flex h-[calc(100vh-320px)]">
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
        />
        
        {/* Alert Details on Right */}
        <AlertDetails 
          selectedAlert={selectedAlert} 
          onOpenRawData={handleOpenRawDataModal}
          onOpenAlertModal={handleOpenAlertModal}
        />
      </div>
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
      
      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#8D0FF5] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-sm font-medium text-[#8D0FF5]">Starithm</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">&copy; 2025 Starithm. All rights reserved.</p>
              <p className="text-xs text-gray-500 mt-1">Astronomer's Platform</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
