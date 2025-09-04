import React, { useState } from "react";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Calendar as CalendarIcon, Search, RotateCcw } from "lucide-react";
import { Calendar as DatePicker } from "@shared/components/ui/calendar";
import {
  FiltersContainer,
  HeaderRow,
  HeaderLeft,
  HeaderTitle,
  Actions,
  FiltersGrid,
  Field,
} from "../styled_components/SearchFilters.styled";

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export interface SearchFilters {
  startDate?: string;
  endDate?: string;
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
      broker: "all",
      event: "",
      alertKey: "",
    });
    onReset();
  };

  return (
    <FiltersContainer>
      <HeaderRow>
        <HeaderLeft>
          <Search size={16} />
          <HeaderTitle>Search Filters</HeaderTitle>
        </HeaderLeft>
        <Actions>
          <Button variant="ghost" size="lg" onClick={handleReset}>
            <RotateCcw className="h-6 w-6" />
          </Button>
          <Button variant="default" size="lg" onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4" />
            <span>{isLoading ? "Searching..." : "Search"}</span>
          </Button>
        </Actions>
      </HeaderRow>

      <FiltersGrid>
        <Field>
          <Label htmlFor="startDate" className="text-xs">Start Date</Label>
          <DatePicker
            triggerClassName="w-full"
            mode="single"
            selected={filters.startDate ? new Date(filters.startDate) : undefined}
            onSelect={(date?: Date) => {
              handleFilterChange("startDate", date ? date.toISOString().split('T')[0] : "");
            }}
          />
        </Field>

        <Field>
          <Label htmlFor="endDate" className="text-xs">End Date</Label>
          <DatePicker
            triggerClassName="w-full"
            mode="single"
            selected={filters.endDate ? new Date(filters.endDate) : undefined}
            onSelect={(date?: Date) => {
              handleFilterChange("endDate", date ? date.toISOString().split('T')[0] : "");
            }}
          />
        </Field>

        <Field>
          <Label htmlFor="broker" className="text-xs">Broker</Label>
          <Select
            value={filters.broker}
            onValueChange={(value) => handleFilterChange("broker", value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
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
        </Field>

        <Field>
          <Label htmlFor="event" className="text-xs">Event</Label>
          <Input
            id="event"
            type="text"
            placeholder="Event name"
            value={filters.event}
            onChange={(e) => handleFilterChange("event", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </Field>

        <Field>
          <Label htmlFor="alertKey" className="text-xs">Alert Key</Label>
          <Input
            id="alertKey"
            type="text"
            placeholder="GCN-12345"
            value={filters.alertKey}
            onChange={(e) => handleFilterChange("alertKey", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </Field>
      </FiltersGrid>
    </FiltersContainer>
  );
}
