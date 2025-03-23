export interface ListItemProps {
    title: string;
    href: string;
    description: string;
}
  
export interface ListItemGroupProps {
    title: string;
    items: ListItemProps[];
}