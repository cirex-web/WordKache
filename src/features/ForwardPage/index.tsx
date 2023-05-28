import React, { useLayoutEffect, useReducer, useRef, useState } from "react";
import css from "./index.module.css";
import { Text } from "../../components/Text";
import { Filter } from "../../types/storageTypes";
import { Icon } from "../../components/Icon";
import { FilterTable } from "./FilterTable";
import { useFilters } from "../../utils/storage/filters";
import { Header } from "../../components/Header";
import { FilterForm } from "./FilterForm";

const Collapsible = ({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading: string;
}) => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    setHeight(containerRef.current?.scrollHeight ?? 0);
  }, []);
  return (
    <div className={css.dropdown}>
      <Text
        type="heading"
        bold
        noSelect
        className={css.dropdownTitle}
        onMouseDown={() => setOpen(!open)}
      >
        <Icon
          name="expand_more"
          style={{
            transform: `rotate(${open ? 0 : -90}deg)`,
            transition: ".2s transform",
            verticalAlign: "middle",
          }}
        />
        {heading}
      </Text>
      <div
        style={{ height: open ? height : 0, transition: ".2s all" }}
        ref={containerRef}
        className={css.dropdownContent}
        aria-hidden={!open}
      >
        {children}
      </div>
    </div>
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
        <Collapsible heading="Create Filter">
          <FilterForm addFilter={addFilter} />
        </Collapsible>
        <Collapsible heading="Active Filters">
          <FilterTable filters={filters === undefined ? [] : filters} />
        </Collapsible>
      </div>
    </div>
  );
};
