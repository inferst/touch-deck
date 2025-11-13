import dynamicIconImports from "lucide-react/dynamicIconImports";
import { DynamicIcon } from "lucide-react/dynamic";
import { FC, memo } from "react";

type IconName = keyof typeof dynamicIconImports;

const icons = Object.keys(dynamicIconImports) as IconName[];

type IconProps = {
  className?: string;
  color?: string;
  width?: string | number | undefined;
  height?: string | number | undefined;
  size?: string | number | undefined;
};

type ReactComponent = FC<IconProps>;

const iconComponents = {} as Record<IconName, ReactComponent>;

for (const name of icons) {
  const NewIcon = (props: IconProps) => {
    return <DynamicIcon {...props} name={name} />;
  };

  iconComponents[name] = NewIcon;
}

type DynamicIconProps = {
  name: IconName;
} & IconProps;

const Icon = memo(({ name, ...props }: DynamicIconProps) => {
  const Icon = iconComponents[name];

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
});

Icon.displayName = "Icon";

export { Icon, icons };
