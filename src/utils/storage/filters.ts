import { Filter } from "../../types/storageTypes"
import { useStorage } from "./storage"

const defaultArray: any[] = [];
export const useFilters = () => {
    const [filters, setFilters] = useStorage<Filter[]>("filters", defaultArray);

    const deleteFilters = (filterIds: string[]) => {
        if (!filters) return;
        setFilters(filters?.filter((filter) => !filterIds.includes(filter.id)));
    };

    const addFilter = (newFilter: Filter) => {
        console.log(newFilter);
        setFilters([...filters ?? [], newFilter]);
    };
    return { filters, deleteFilters, addFilter };
}
