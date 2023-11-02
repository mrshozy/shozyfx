"use client"

import * as React from "react"

import { cn } from "../libs/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import {NavFeatures} from "../conf/cons";
import {buttonVariants} from "./ui/button";
import {Link} from "react-router-dom";


export function NavMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList className={"text-muted-foreground"}>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(buttonVariants({variant: "ghost"}), "focus-visible:ring-transparent")}>Features</NavigationMenuTrigger>
                    <NavigationMenuContent className={"focus-visible:ring-transparent dark:border-gray-700"}>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] focus-visible:ring-transparent">
                            {NavFeatures.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link to="/prices">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Prices
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link to="/contacts" >
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Contacts
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
