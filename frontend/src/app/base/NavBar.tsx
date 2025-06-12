import React from "react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ListItemGroupProps } from "@/types"

interface NavBarProps {
    components: ListItemGroupProps[]
}

const NavBar: React.FC<NavBarProps> = ({components}) => {

  const selected = "text-highlight font-bold hover:text-highlight transition duration-150"
  const windowName = window.location.pathname

  return (
      <NavigationMenu className="hidden lg:block">
      <NavigationMenuList className="gap-4">
        {components.map((component) => (
          <NavigationMenuItem key={component.title + "Key"}>
            <NavigationMenuTrigger>{component.title}</NavigationMenuTrigger>
            <NavigationMenuContent className="">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {component.items.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        {/* <NavigationMenuItem>
          <Link to="/pricing">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <div className={windowName === "/pricing" ? selected : "hover:text-stone-300 transition duration-150"}>Pricing</div>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/product">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <div className={windowName === "/product" ? selected : "hover:text-stone-300 transition duration-150"}>Product</div>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NavBar

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-neutral-950",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"