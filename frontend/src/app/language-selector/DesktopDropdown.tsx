'use client'

import * as React from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
]

export function DesktopDropdown() {
  const [selectedLanguage, setSelectedLanguage] = React.useState('en')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          <Globe className="mr-2 h-4 w-4" />
          {languages.find(lang => lang.code === selectedLanguage)?.name}
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuCheckboxItem
            key={language.code}
            checked={selectedLanguage === language.code}
            onCheckedChange={() => setSelectedLanguage(language.code)}
          >
            {language.name}
            {selectedLanguage === language.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}