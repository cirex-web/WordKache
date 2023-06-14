import React, { useState } from "react";
import css from "./index.module.css";
import { Filter } from "../../../types/storageTypes";
import { handleRowSelect } from "../../../utils/rangeSelect";
import classNames from "classnames";
import { useFolderContext } from "../../../contexts/FolderProvider";
import { Text } from "../../../components/Text";

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
    <div className={css.tableContainer}>
      {filters.length > 0 ? (
        <table className={css.filterTable}>
          <thead>
            <tr className={css.filterHeader}>
              <th>
                <Text type="subheading">Conditions</Text>
              </th>
              <th>
                <Text type="subheading">Destination</Text>
              </th>
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
                  <Text type="paragraph">
                    {filter.frontLang && (
                      <div>
                        <b>Front Lang:</b> {filter.frontLang.join(" ")}
                      </div>
                    )}
                    {filter.backLang && (
                      <div>
                        <b>Back Lang:</b> {filter.backLang.join(" ")}
                      </div>
                    )}
                    {filter.words && (
                      <div>
                        <b>Has Words:</b> {filter.words.join(" ")}
                      </div>
                    )}
                    {filter.length && (
                      <div>
                        <b>Length:</b> {filter.length.direction} than{" "}
                        {filter.length.number}
                      </div>
                    )}
                  </Text>
                </td>

                <td>
                  <Text type="paragraph">
                    {folders.find((folder) => folder.id === filter.destination)
                      ?.name ?? "This folder no longer exists"}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Text type="subheading" style={{ padding: "10px" }}>
          No filters yet!
        </Text>
      )}
    </div>
  );
};
