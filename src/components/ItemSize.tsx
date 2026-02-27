import { createListCollection, Portal, Select } from "@chakra-ui/react";

const values = createListCollection({
  items: [
    { label: 48, value: "48" },
    { label: 72, value: "72" },
    { label: 96, value: "96" },
    { label: 120, value: "120" },
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
      width={"fit"}
      onValueChange={(e) => props.setTake(Number.parseInt(e.value[0]))}
      defaultValue={[props.take.toString()]}
    >
      <Select.HiddenSelect />
      <Select.Label alignContent={"center"}>Results per page :</Select.Label>
      <Select.Control width={"5rem"}>
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
