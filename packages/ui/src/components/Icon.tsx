import dynamicIconImports from "lucide-react/dynamicIconImports";
import { DynamicIcon } from "lucide-react/dynamic";
import { FC, memo } from "react";

type IconName = keyof typeof dynamicIconImports;

const icons = Object.keys(dynamicIconImports) as IconName[];

type ReactComponent = FC<{ className?: string }>;

const iconComponents = {} as Record<IconName, ReactComponent>;

for (const name of icons) {
  const NewIcon = () => {
    return <DynamicIcon name={name} />;
  };

  iconComponents[name] = NewIcon;
}

type DynamicIconProps = {
  name: IconName;
  className?: string;
};

const Icon = memo(({ name, ...props }: DynamicIconProps) => {
  const Icon = iconComponents[name];

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
});

Icon.displayName = "Icon";

export { Icon, icons };
