import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import TuneIcon from "@mui/icons-material/Tune";
import { Button } from "~/shared/ui/Button";
import { TitleFilters } from "~/features/titleFilter";
import { FilterPopover } from "~/shared/ui/FilterPopover";
import { useTitleStats } from "../hooks/useTitleStats";

interface TitleFiltersDropdownProps {
  userId: string
}

export const TitleFiltersDropdown = ({
  userId
}: TitleFiltersDropdownProps) => {
  const { data } = useTitleStats(userId);

  return (
    <FilterPopover
      title="Filters & Sorting"
      sideOffset={-40}
      trigger={
        <Button
          variant="filter"
        >
          <TuneIcon sx={{ fontSize: 20 }} className="text-primary" />
        </Button>
      }
    >
      <TitleFilters
        compact
        statusCount={data?.statusCount}
        typeCount={data?.typeCount}
      />
    </FilterPopover>
  );
};