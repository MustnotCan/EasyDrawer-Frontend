import { createListCollection, Portal, Select } from "@chakra-ui/react";

const values = createListCollection({
  items: [
    { label: 25, value: "25" },
    { label: 50, value: "50" },
    { label: 75, value: "75" },
    { label: 100, value: "100" },
  ],
});
export default function ItemSize(props: {
  setTake: (arg0: number) => void;
  take: number;
}) {
  return (
    <Select.Root
      collection={values}
      flexDir={"row"}
      width={"300px"}
      onValueChange={(e) => props.setTake(Number.parseInt(e.value[0]))}
      defaultValue={[props.take.toString()]}
    >
      <Select.HiddenSelect />
      <Select.Label alignContent={"center"}>
        Number of books per page :
      </Select.Label>
      <Select.Control width={"100px"}>
        <Select.Trigger>
          <Select.ValueText placeholder={props.take.toString()} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {values.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
