'use client'
import * as React from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem, NavigationMenuList,
    NavigationMenuTrigger
} from "../../components/ui/navigation-menu";
import Icons from "../../components/Icons";
import {cn} from "../../libs/utils";
import {Button} from "../../components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, CommandSeparator, CommandShortcut
} from "../../components/ui/command";
import {Calculator, Calendar, CreditCard, Settings, Smile, User} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../hooks/useTheme";

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    children: React.ReactNode
}


export function SearchDialog(x: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate()
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                x.setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [x])
    return (
        <>
            <CommandDialog open={x.open} onOpenChange={x.setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={()=>{
                            navigate("/dashboard/calender")
                            x.setOpen(false)
                        }}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Calendar</span>
                        </CommandItem>
                        <CommandItem>
                            <Smile className="mr-2 h-4 w-4" />
                            <span>Search Emoji</span>
                        </CommandItem>
                        <CommandItem >
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>Calculator</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
export function Toolbar(props: Props) {
    const [open, setOpen] = React.useState(false)
    const {theme, setTheme} = useTheme();
    return (
        <NavigationMenu className={cn(props.className)}>
            <NavigationMenuItem className={"list-none h-16 flex flex-row justify-start items-center"}>
                <NavigationMenuList>
                    <NavigationMenuTrigger className={"lg:hidden"}>
                        <svg
                            fill="none" viewBox="0 0 15 15" height="1em" width="1em"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                        >
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M1.5 3a.5.5 0 000 1h12a.5.5 0 000-1h-12zM1 7.5a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className={cn("w-72")}>
                        {props.children}
                    </NavigationMenuContent>
                    <NavigationMenuItem>
                        <Button variant={"ghost"} onClick={()=>setOpen(true)}>
                            <Icons.search className="h-4 w-4" />
                        </Button>
                        <SearchDialog open={open} setOpen={setOpen}/>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Button variant={"ghost"} onClick={()=> setTheme(theme == "light" ? "dark" : "light")}>
                            {theme == "light" ? <Icons.dark_mode className="h-4 w-4"/> : <Icons.light_mode className="h-4 w-4"/>}
                        </Button>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenuItem>
        </NavigationMenu>
    );
}