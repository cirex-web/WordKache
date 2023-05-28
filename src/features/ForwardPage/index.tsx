import React, { useLayoutEffect, useReducer, useRef, useState } from "react";
import css from "./index.module.css";
import { Text } from "../../components/Text";
import { Filter } from "../../types/storageTypes";
import { Icon } from "../../components/Icon";
import { FilterTable } from "./FilterTable";
import { useFilters } from "../../utils/storage/filters";
import { Header } from "../../components/Header";
import { FilterForm } from "./FilterForm";
import { Button } from "../../components/Button";

const Collapsible = ({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading: string;
}) => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<number | "auto">(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(!open);
          if (open) {
            //this is the previous state - so we're closing rn
            containerRef.current?.animate(
              [
                { height: containerRef.current.scrollHeight + "px" },
                { height: 0 },
              ],
              { fill: "forwards", duration: 200, easing: "ease-in-out" }
            );
          } else {
            containerRef.current?.animate(
              [{ height: containerRef.current.scrollHeight + "px" }],
              { fill: "forwards", duration: 200, easing: "ease-in-out" }
            );
          }
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
      <div
        style={{
          transition: ".2s all",
          visibility: open ? "initial" : "hidden",
        }}
        ref={containerRef}
        className={css.dropdownContent}
        onTransitionEnd={() => setHeight(open ? "auto" : 0)}
      >
        {children}
      </div>
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
        <Collapsible heading="Create Filter">
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
