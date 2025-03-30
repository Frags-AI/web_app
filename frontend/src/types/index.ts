import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface ListItemProps {
    title: string;
    href: string;
    description: string;
}
  
export interface ListItemGroupProps {
    title: string;
    items: ListItemProps[];
}

export interface IconProps {
  icon: IconDefinition
  label: string
  id: string,
  tab: string
}

export interface IconPropsGroup {
  title: string
  items: IconProps[]
}