import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Search, RotateCcw } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export interface SearchFilters {
  startDate?: string;
  endDate?: string;
  confidenceMin?: number;
  confidenceMax?: number;
  broker?: string;
  event?: string;
  alertKey?: string;
  limit?: number;
  offset?: number;
}

const brokers = [
  "All Brokers",
  "GCN",
  "ATel",
  "TNS",
  "LIGO",
];

export function SearchFilters({ onSearch, onReset, isLoading = false }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    startDate: "",
    endDate: "",
    confidenceMin: undefined,
    confidenceMax: undefined,
    broker: "all",
    event: "",
    alertKey: "",
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    // Remove empty values and handle "all" broker value
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (key === "broker" && value === "all") return false; // Don't include "all" in API call
        return value !== "" && value !== undefined && value !== null;
      })
    );
    onSearch(cleanFilters as SearchFilters);
  };

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      confidenceMin: undefined,
      confidenceMax: undefined,
      broker: "all",
      event: "",
      alertKey: "",
    });
    onReset();
  };

  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Search Filters</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>{isLoading ? "Searching..." : "Search"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-xs">Start Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-xs">End Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Confidence Min */}
        <div className="space-y-2">
          <Label htmlFor="confidenceMin" className="text-xs">Confidence Min</Label>
          <Input
            id="confidenceMin"
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="0.0"
            value={filters.confidenceMin || ""}
            onChange={(e) => handleFilterChange("confidenceMin", e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>

        {/* Confidence Max */}
        <div className="space-y-2">
          <Label htmlFor="confidenceMax" className="text-xs">Confidence Max</Label>
          <Input
            id="confidenceMax"
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="1.0"
            value={filters.confidenceMax || ""}
            onChange={(e) => handleFilterChange("confidenceMax", e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>

        {/* Broker */}
        <div className="space-y-2">
          <Label htmlFor="broker" className="text-xs">Broker</Label>
          <Select
            value={filters.broker}
            onValueChange={(value) => handleFilterChange("broker", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Brokers" />
            </SelectTrigger>
            <SelectContent>
              {brokers.map((broker) => (
                <SelectItem key={broker} value={broker === "All Brokers" ? "all" : broker}>
                  {broker}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event */}
        <div className="space-y-2">
          <Label htmlFor="event" className="text-xs">Event</Label>
          <Input
            id="event"
            type="text"
            placeholder="Event name"
            value={filters.event}
            onChange={(e) => handleFilterChange("event", e.target.value)}
          />
        </div>

        {/* Alert Key */}
        <div className="space-y-2">
          <Label htmlFor="alertKey" className="text-xs">Alert Key</Label>
          <Input
            id="alertKey"
            type="text"
            placeholder="GCN-12345"
            value={filters.alertKey}
            onChange={(e) => handleFilterChange("alertKey", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
