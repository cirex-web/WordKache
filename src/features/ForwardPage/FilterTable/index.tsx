import React, { useState } from "react";
import css from "./index.module.css";
import { Filter } from "../../../types/storageTypes";
import { handleRowSelect } from "../../../utils/rangeSelect";
import classNames from "classnames";
import { useFolderContext } from "../../../contexts/FolderProvider";

export const FilterTable = ({ filters }: { filters: Filter[] }) => {
  const { folders } = useFolderContext();
  const [selectedFilter, setSelectedFilter] = useState<Filter[]>([]);
  const pivotPointRef = React.useRef(0);

  const handleFilterSelect = (
    ev: React.MouseEvent<HTMLTableRowElement, MouseEvent>
  ) => {
    const filterIds = filters.map((filter) => filter.id);
    const selectedFilters = selectedFilter.map((filter) => filter.id);
    const filterId = ev.currentTarget.id;
    const newSelection = handleRowSelect(
      ev,
      filterId,
      filterIds,
      selectedFilters,
      pivotPointRef
    );
    return filters.filter((filter) => newSelection.includes(filter.id));
  };

  return (
    <div className={css.container}>
      {/* <Text
        type="heading"
        lineHeight={2}
        bold
        style={{ borderBottom: "2px solid var(--light-1)" }}
      >
        Active Filters
      </Text> */}
      <div className={css.tableContainer}>
        <table className={css.filterTable}>
          <thead>
            <tr className={css.filterHeader}>
              <th>Conditions</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            {filters.map((filter) => (
              <tr
                key={filter.id}
                id={filter.id}
                onMouseDown={(ev) => setSelectedFilter(handleFilterSelect(ev))}
                className={classNames({
                  [css.selected]: selectedFilter.some(
                    (selectedF) => selectedF.id === filter.id
                  ),
                })}
              >
                <td className={css.filterBody}>
                  <div>Front Lang: {filter.frontLang ?? "No filter"}</div>
                  <div>Back Lang: {filter.backLang ?? "No filter"}</div>
                  <div>Has Words: {filter.words ?? "No filter"}</div>
                  <div>Length: {filter.length?.number ?? "No filter"}</div>
                </td>

                <td>
                  {folders.find((folder) => folder.id === filter.destination)
                    ?.name ?? "This folder no longer exists"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
