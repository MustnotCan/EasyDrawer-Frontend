import { Breadcrumb } from "@chakra-ui/react";
import { Fragment } from "react/jsx-runtime";

export function MultiTaggerBreadCrumb(props: {
  dirs: string[];
  setDir: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <Breadcrumb.Root variant={"plain"}>
      <Breadcrumb.List>
        {props.dirs.map((dir, index) => (
          <Fragment key={dir + index}>
            <Breadcrumb.Item
              className="hover:cursor-pointer"
              onClick={() =>
                props.setDir((prev) => {
                  const indexOfDir = prev.indexOf(dir);
                  return prev.slice(0, indexOfDir + 1);
                })
              }
            >
              {index == 0 ? "root" : dir}
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
          </Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
