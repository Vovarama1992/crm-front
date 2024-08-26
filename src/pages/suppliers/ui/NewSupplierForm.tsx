import type { CreateSupplierDto } from '@/entities/departure/departure.types'

import React, { useState } from 'react'

type NewSupplierFormProps = {
  onAddSupplier: (newSupplier: CreateSupplierDto) => void
  onClose: () => void
}

const NewSupplierForm: React.FC<NewSupplierFormProps> = ({ onAddSupplier, onClose }) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [notes, setNotes] = useState('')
  const [inn, setInn] = useState('') // Добавлено состояние для ИНН

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSupplier: CreateSupplierDto = {
      address,
      contactPerson,
      email,
      inn, // Добавлено ИНН
      name,
      note: notes,
      phone,
      website,
    }

    onAddSupplier(newSupplier)
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'}>
      <div className={'bg-white p-6 rounded shadow-lg'}>
        <h2 className={'text-xl font-bold mb-4'}>Новый поставщик</h2>
        <form onSubmit={handleSubmit}>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>Название</label>
            <input
              className={'w-full border p-2 rounded'}
              onChange={e => setName(e.target.value)}
              required
              type={'text'}
              value={name}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>Адрес</label>
            <input
              className={'w-full border p-2 rounded'}
              onChange={e => setAddress(e.target.value)}
              required
              type={'text'}
              value={address}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>Телефон</label>
            <input
              className={'w-full border p-2 rounded'}
              onChange={e => setPhone(e.target.value)}
              required
              type={'text'}
              value={phone}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>E-mail</label>
            <input
              className={'w-full border p-2 rounded'}
              onChange={e => setEmail(e.target.value)}
              required
              type={'email'}
              value={email}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>Вебсайт</label>
            <input
              className={'w-full border p-2 rounded'}
              onChange={e => setWebsite(e.target.value)}
              type={'text'}
              value={website}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>Контактное лицо</label>
            <input
              className={'w-full border p-2 rounded'}
              onChange={e => setContactPerson(e.target.value)}
              required
              type={'text'}
              value={contactPerson}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>ИНН</label>{' '}
            {/* Добавлено поле для ИНН */}
            <input
              className={'w-full border p-2 rounded'}
              onChange={e => setInn(e.target.value)}
              type={'text'}
              value={inn}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-bold mb-1'}>Примечание</label>
            <input
              className={'w-full border p-2 rounded'}
              onChange={e => setNotes(e.target.value)}
              type={'text'}
              value={notes}
            />
          </div>
          <div className={'flex justify-end'}>
            <button className={'bg-blue-500 text-white px-4 py-2 rounded mr-2'} type={'submit'}>
              Добавить
            </button>
            <button
              className={'bg-gray-500 text-white px-4 py-2 rounded'}
              onClick={onClose}
              type={'button'}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewSupplierForm
