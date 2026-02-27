import { Switch } from "@chakra-ui/react/switch";
export default function MainViewSwitch(props: {
  isAnd: boolean;
  setIsAnd: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Switch.Root
      checked={props.isAnd}
      onCheckedChange={() => props.setIsAnd(!props.isAnd)}
      size={{ base: "md", md: "sm" }}
      width={"fit"}
    >
      <Switch.HiddenInput />
      <Switch.Label>Or</Switch.Label>
      <Switch.Control />
      <Switch.Label>And</Switch.Label>
    </Switch.Root>
  );
}
