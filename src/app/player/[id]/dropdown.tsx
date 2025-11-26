'use client'

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import rarityColor from '@/lib/colours'
import { CardDefinition } from '@/data/cards'

// Props for the dropdown
interface CardDropdownProps {
  cards: CardDefinition[]
  selectedCard: number | null
  setSelectedCard: (id: number | null) => void
}

// Card Dropdown Component
export default function CardDropdown({
  cards,
  selectedCard,
  setSelectedCard,
}: CardDropdownProps) {
  return (
    <div className="w-full max-w-sm">
      <Listbox value={selectedCard} onChange={setSelectedCard}>
        {({ open }) => (
          <div className="relative mt-2">
            <ListboxButton
              className="relative w-full cursor-pointer rounded-lg bg-gray-800 py-2 pl-3 pr-10 text-left text-white shadow-md hover:bg-gray-700 transition-all duration-200"
            >
              <span className="block truncate">
                {selectedCard
                  ? cards.find((c) => c.id === selectedCard)?.name
                  : 'Select a card'}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute mt-2 w-full z-10 rounded-lg bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <ListboxOptions className="max-h-60 overflow-auto py-2 text-sm">
                    {cards.map((card) => (
                      <ListboxOption
                        key={card.id}
                        value={card.id}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-gray-700 text-white' : 'text-gray-300'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex flex-col">
                              <span
                                className={`font-medium bg-gradient-to-r ${rarityColor(
                                  card.rarity
                                )} bg-clip-text text-transparent`}
                              >
                                {card.name}
                              </span>

                              <span className="text-xs text-gray-400">
                                ATK {card.attack ?? '—'} / DEF {card.defense ?? '—'} —{' '}
                                <span className="capitalize">{card.rarity}</span>
                              </span>
                            </div>

                            {selected && (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-gray-300'
                                }`}
                              >
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Listbox>
    </div>
  )
}
