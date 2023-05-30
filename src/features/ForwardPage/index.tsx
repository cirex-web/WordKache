import React, { useRef, useState } from "react";
import css from "./index.module.css";
import { Text } from "../../components/Text";
import { Filter } from "../../types/storageTypes";
import { Icon } from "../../components/Icon";
import { FilterTable } from "./FilterTable";
import { useFilters } from "../../utils/storage/filters";
import { Header } from "../../components/Header";
import { FilterForm } from "./FilterForm";
import { Button } from "../../components/Button";
import { Collapse } from "../../components/Collapse";

const Collapsible = ({
  children,
  heading,
  defaultOpen,
}: {
  children: React.ReactNode;
  heading: string;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(!open);
        }}
        className={css.dropdownButton}
      >
        <Text type="heading" bold noSelect className={css.dropdownTitle}>
          <Icon
            name="expand_more"
            style={{
              transform: `rotate(${open ? 0 : -90}deg)`,
              transition: ".2s transform",
              verticalAlign: "text-bottom",
            }}
          />
          {heading}
        </Text>
      </Button>
      <Collapse open={open}>{children}</Collapse>
    </>
  );
};

export const ForwardingPage = () => {
  const { filters, addFilter, deleteFilters } = useFilters();

  const [selectedFilter, setSelectedFilter] = useState<Filter[]>([]);

  const handleBackspace = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === "Backspace") {
      deleteFilters(selectedFilter.map((filter) => filter.id));
      setSelectedFilter([]);
    }
  };

  return (
    <div className={css.container} onKeyDown={handleBackspace}>
      <Header headingText="Filters" />
      <div className={css.content}>
        <Collapsible heading="Create Filter" defaultOpen={true}>
          <FilterForm addFilter={addFilter} />
        </Collapsible>
        <Collapsible heading="Active Filters">
          <FilterTable filters={filters === undefined ? [] : filters} />
          <Collapsible heading="what's up?">Just a test lol</Collapsible>
        </Collapsible>
      </div>
    </div>
  );
};
