import { useState } from "react";
import { Button } from "@shared/components/ui/button";
import { Badge } from "@shared/components/ui/badge";
import { Filter, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@shared/components/ui/dropdown-menu";

const eventTypes = [
  "All Events",
  "Gamma-Ray Burst",
  "Supernova",
  "Gravitational Wave",
  "Transient",
  "Variable Star",
];

const brokers = [
  "All Brokers",
  "GCN",
  "ATel",
  "TNS",
  "LIGO",
];

const timeRanges = [
  "Last Hour",
  "Last 24 Hours",
  "Last Week",
  "Last Month",
];

export function HorizontalFilters() {
  const [selectedEventType, setSelectedEventType] = useState("All Events");
  const [selectedBroker, setSelectedBroker] = useState("All Brokers");
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 24 Hours");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedEventType("All Events");
    setSelectedBroker("All Brokers");
    setSelectedTimeRange("Last 24 Hours");
  };

  const getFilterLabel = () => {
    const filters = [];
    if (selectedEventType !== "All Events") filters.push(selectedEventType);
    if (selectedBroker !== "All Brokers") filters.push(selectedBroker);
    if (selectedTimeRange !== "Last 24 Hours") filters.push(selectedTimeRange);
    return filters.length > 0 ? `${filters.length} filters` : "All filters";
  };

  return (
    <div className="border-b bg-background">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  Event Type: {selectedEventType}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {eventTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedEventType === type}
                    onCheckedChange={() => {
                      setSelectedEventType(type);
                      if (type !== "All Events") addFilter(type);
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  Broker: {selectedBroker}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {brokers.map((broker) => (
                  <DropdownMenuCheckboxItem
                    key={broker}
                    checked={selectedBroker === broker}
                    onCheckedChange={() => {
                      setSelectedBroker(broker);
                      if (broker !== "All Brokers") addFilter(broker);
                    }}
                  >
                    {broker}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  Time: {selectedTimeRange}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {timeRanges.map((range) => (
                  <DropdownMenuCheckboxItem
                    key={range}
                    checked={selectedTimeRange === range}
                    onCheckedChange={() => {
                      setSelectedTimeRange(range);
                      addFilter(range);
                    }}
                  >
                    {range}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        {activeFilters.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Active:</span>
            <div className="flex flex-wrap gap-1">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="text-xs flex items-center space-x-1"
                >
                  <span>{filter}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
