'use client'

import * as React from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
]

export function MobileDropdown() {
  const [selectedLanguage, setSelectedLanguage] = React.useState('en')
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code)
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Globe className="mr-2 h-4 w-4" />
          {languages.find(lang => lang.code === selectedLanguage)?.name}
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select Language</DrawerTitle>
          <DrawerDescription>Choose your preferred language</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] px-4">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant="ghost"
              className="w-full justify-start font-normal mb-1"
              onClick={() => handleLanguageChange(language.code)}
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedLanguage === language.code ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {language.name}
            </Button>
          ))}
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}