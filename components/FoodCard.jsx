'use client'

import Link from "next/link"

export default function FoodCard({ food }) {
  return (
    <Link href={`/dashboard/vault/${food.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
        <img src={food.imageUrl} alt={food.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
          <p className="text-gray-600 text-sm">Click to view details</p>
        </div>
      </div>
    </Link>
  )
}
