'use client'

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

interface SelectSearchProps {
    options: Array<{ label: string; value: string }>
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function SelectSearch({
    options,
    value,
    onValueChange,
    placeholder,
    disabled,
    className
} : SelectSearchProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("")
    const selectedOption = options.find((option) => option.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                    disabled={disabled}
                >
                    { selectedOption ? selectedOption.label : placeholder }
                    <ChevronDown className="ml-2 w-4 h-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput
                            placeholder="Entre com iniciais para pesquisar"
                            value={searchValue}
                            onValueChange={setSearchValue}
                            className="flex h-10 w-full rounded-md bg-transparent py-3 
                            text-sm outline-none placeholder:text-muted-foreground 
                            disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <CommandList>
                        <CommandEmpty>
                            Nenhum Registro Encontrado
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onValueChange?.(currentValue === value ? "": currentValue);
                                        setOpen(false);
                                    }}
                                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Check 
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    { option.label }
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}