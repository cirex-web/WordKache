import React, { useState } from "react";
import css from "./index.module.css";
import { Folder, Filter } from "../../../types/storageTypes";
import { handleRowSelect } from "../../../utils/rangeSelect";
import { Text } from "../../../components/Text";
import classNames from "classnames";

export const FilterTable = ({
  filters,
  folders,
}: {
  filters: Filter[];
  folders: Folder[];
}) => {
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
      <Text
        type="heading"
        lineHeight={2}
        bold
        style={{ borderBottom: "2px solid var(--light-1)" }}
      >
        Active Filters
      </Text>
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
                  <div>
                    Front Lang:{" "}
                    {filter.frontLang === undefined
                      ? "No Filter"
                      : filter.frontLang}
                  </div>
                  <div>
                    Back Lang:{" "}
                    {filter.backLang === undefined
                      ? "No Filter"
                      : filter.backLang}
                  </div>
                  <div>
                    Has Words:{" "}
                    {filter.words === undefined ? "No Filter" : filter.words}
                  </div>
                  <div>
                    Length:{" "}
                    {filter.length === undefined
                      ? "No Filter"
                      : filter.length.number}
                  </div>
                </td>

                <td>
                  {
                    folders.find((folder) => folder.id === filter.destination)!
                      .name
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
