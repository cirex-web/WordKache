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
        console.log(newFilter);
        ChromeStorage.setPair("filters", [...filters ?? [], newFilter]);
    };
    return { filters, deleteFilters, addFilter };
}
