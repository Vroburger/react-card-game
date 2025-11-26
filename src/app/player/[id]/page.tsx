'use client'

import React, { useState, useEffect, use } from 'react'
import CardDropdown from './dropdown'
import rarityColor from '@/lib/colours'
import type { CardDefinition } from '@/data/cards'

type UserCard = {
  id: number
  quantity: number
  cardId: number
  card: CardDefinition | null
}

type User = {
  id: number
  username: string
  email: string
  collection: UserCard[]
}

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState('1')
  const [message, setMessage] = useState('')
  const [cards, setCards] = useState<CardDefinition[]>([])
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${id}`)
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards')
      if (res.ok) {
        const data = await res.json()
        setCards(data)
      }
    } catch (error) {
      console.error('Failed to load cards:', error)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCards()
  }, [id])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch(`/api/user-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(id),
          cardId: selectedCard,
          quantity: parseInt(quantity),
        }),
      })

      if (res.ok) {
        await fetchUser()
        setMessage('Updated successfully!')
      } else {
        setMessage('Failed to update card.')
      }
    } catch {
      setMessage('Network error.')
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>
  if (!user) return <div className="p-8 text-red-500">User not found</div>

  return (
    <div className="p-8 text-gray-100 min-h-screen bg-gradient-to-b from-gray-950 to-gray-800">
      <h1 className="text-4xl font-extrabold mb-2 text-center">
        {user.username}&apos;s Collection
      </h1>
      <p className="text-gray-400 mb-10 text-center">{user.email}</p>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg mb-10 border border-gray-700"
      >
        <h2 className="text-lg font-bold mb-4 text-center">Add or Update Card</h2>
        <div className="flex flex-col gap-3">
          <CardDropdown
            cards={cards}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />

          <input
            type="number"
            placeholder="Quantity (0 to remove)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700"
            required
          />

          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>

          {message && <p className="text-center mt-2">{message}</p>}
        </div>
      </form>

      {/* Card Display */}
      {user.collection.length === 0 ? (
        <p className="text-center text-gray-400">No cards in collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {user.collection.map((uc) => (
            <div
              key={uc.id}
              className={`rounded-xl shadow-lg p-4 border border-gray-700 bg-gradient-to-br ${rarityColor(
                uc.card?.rarity ?? ''
              )} hover:scale-105 transition-transform`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{uc.card?.name ?? 'Unknown Card'}</h2>
                <span className="text-sm bg-black/50 px-2 py-1 rounded-md">x{uc.quantity}</span>
              </div>

              <p className="text-sm italic mb-2 text-gray-200">
                {uc.card?.text || 'No description'}
              </p>

              <div className="text-sm space-y-1">
                {uc.card?.attack !== undefined && <p><b>Attack:</b> {uc.card.attack}</p>}
                {uc.card?.defense !== undefined && <p><b>Defense:</b> {uc.card.defense}</p>}
                <p><b>Type:</b> {uc.card?.type ?? '—'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
