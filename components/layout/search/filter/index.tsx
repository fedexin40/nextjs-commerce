import { SortFilterItem } from 'lib/constants';
import FilterItemDropdown from './dropdown';

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

export default function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <div className="flex w-48 flex-row items-center gap-x-3 align-middle">
      <div className="w-full">
        <FilterItemDropdown list={list} />
      </div>
    </div>
  );
}
