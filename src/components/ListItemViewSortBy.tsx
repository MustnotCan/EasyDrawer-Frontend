import {
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from "react-icons/hi";
import { orderByType } from "../types/types";
import { createListCollection, Portal, Select } from "@chakra-ui/react";

const orderByValues = createListCollection({
  items: [
    {
      label: "Title",
      value: "title asc",
      icon: <HiOutlineSortAscending />,
    },
    {
      label: "Title",
      value: "title desc",
      icon: <HiOutlineSortDescending />,
    },
    {
      label: "added Date",
      value: "addedDate asc",
      icon: <HiOutlineSortAscending />,
    },
    {
      label: "added Date",
      value: "addedDate desc",
      icon: <HiOutlineSortDescending />,
    },
    {
      label: "Read date",
      value: "lastAccess asc",
      icon: <HiOutlineSortAscending />,
    },
    {
      label: "Read date",
      value: "lastAccess desc",
      icon: <HiOutlineSortDescending />,
    },
    {
      label: "Modified date",
      value: "lastModified asc",
      icon: <HiOutlineSortAscending />,
    },
    {
      label: "Modified date",
      value: "lastModified desc",
      icon: <HiOutlineSortDescending />,
    },
  ],
  itemToString: (item) => item.label,
});
export default function ListItemViewSortBy(props: {
  orderBy: orderByType;
  setOrderBy: React.Dispatch<
    React.SetStateAction<{
      criteria: string;
      direction: string;
    }>
  >;
}) {
  return (
    <Select.Root
      collection={orderByValues}
      flexDir={"row"}
      width={"300px"}
      onValueChange={(e) =>
        props.setOrderBy(() => ({
          criteria: e.value[0].split(" ")[0],
          direction: e.value[0].split(" ")[1],
        }))
      }
      value={[props.orderBy.criteria + " " + props.orderBy.direction]}
    >
      <Select.HiddenSelect />
      <Select.Label alignContent={"center"}>Order By:</Select.Label>
      <Select.Control width={"150px"}>
        <Select.Trigger>
          <Select.ValueText placeholder="Select an order" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {orderByValues.items.map((item) => (
              <Select.Item item={item} key={item.label + item.value}>
                {item.label} {item.icon}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
