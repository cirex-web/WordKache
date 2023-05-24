import { Filter } from "../../types/storageTypes"
import { ChromeStorage, useStorage } from "./storage"

const defaultArray: any[] = [];
export const useFilters = () => {
    const filters = useStorage<Filter[]>("filters", defaultArray);

    const deleteFilters = (filterIds: string[]) => {
        if (!filters) return;
        ChromeStorage.setPair(
            "filters",
            filters?.filter((filter) => !filterIds.includes(filter.id))
        );
    };

    const addFilter = (newFilter: Filter) => {
        const assertFilters = filters === undefined ? [] : filters;
        ChromeStorage.setPair("filters", [...assertFilters, newFilter]);
    };
    return { filters, deleteFilters, addFilter };
}
