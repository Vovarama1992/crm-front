import type { CreateSupplierDto } from '@/entities/departure/departure.types'

import React, { useState } from 'react'

import {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from '@/entities/departure/departure.api'
import { useMeQuery } from '@/entities/session'

import NewSupplierForm from './NewSupplierForm'

export const SuppliersPage: React.FC = () => {
  const [searchName, setSearchName] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchContactPerson, setSearchContactPerson] = useState('')
  const [searchNotes, setSearchNotes] = useState('')
  const [editIndex, setEditIndex] = useState<{ column: string; row: number } | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: meData } = useMeQuery()
  const { data: suppliersData, refetch } = useGetSuppliersQuery()
  const [createSupplier] = useCreateSupplierMutation()
  const [updateSupplier] = useUpdateSupplierMutation()

  const isDirector = meData?.roleName === 'Директор' || meData?.roleName === 'Закупщик'

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSearchTerm(e.target.value)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    supplierId: number,
    column: string
  ) => {
    const updatedValue = e.target.value

    updateSupplier({ data: { [column]: updatedValue }, id: supplierId })
      .unwrap()
      .then(() => refetch())
  }

  const handleAddSupplier = (newSupplier: CreateSupplierDto) => {
    createSupplier(newSupplier)
      .unwrap()
      .then(() => {
        refetch()
        setIsFormOpen(false)
      })
  }

  const filteredData = suppliersData?.filter(
    supplier =>
      supplier.name.toLowerCase().includes(searchName.toLowerCase()) &&
      supplier.address.toLowerCase().includes(searchAddress.toLowerCase()) &&
      supplier.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
      supplier.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      supplier.contactPerson.toLowerCase().includes(searchContactPerson.toLowerCase()) &&
      supplier.note?.toLowerCase().includes(searchNotes.toLowerCase())
  )

  return (
    <div className={'absolute left-[15%] top-[15%]'}>
      <h2 className={'text-xl font-bold mt-4'}>Список поставщиков</h2>
      <div className={'mb-4'}>
        <input
          className={'border p-2 mb-2 mr-2'}
          onChange={e => handleSearchChange(e, setSearchName)}
          placeholder={'Поиск по названию...'}
          type={'text'}
          value={searchName}
        />
        <input
          className={'border p-2 mb-2 mr-2'}
          onChange={e => handleSearchChange(e, setSearchAddress)}
          placeholder={'Поиск по адресу...'}
          type={'text'}
          value={searchAddress}
        />
        <input
          className={'border p-2 mb-2 mr-2'}
          onChange={e => handleSearchChange(e, setSearchPhone)}
          placeholder={'Поиск по телефону...'}
          type={'text'}
          value={searchPhone}
        />
        <input
          className={'border p-2 mb-2 mr-2'}
          onChange={e => handleSearchChange(e, setSearchEmail)}
          placeholder={'Поиск по email...'}
          type={'text'}
          value={searchEmail}
        />
        <input
          className={'border p-2 mb-2 mr-2'}
          onChange={e => handleSearchChange(e, setSearchContactPerson)}
          placeholder={'Поиск по контактному лицу...'}
          type={'text'}
          value={searchContactPerson}
        />
        <input
          className={'border p-2 mb-2'}
          onChange={e => handleSearchChange(e, setSearchNotes)}
          placeholder={'Поиск по примечаниям...'}
          type={'text'}
          value={searchNotes}
        />
      </div>
      <table className={'min-w-full bg-white border'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2'}>Наименование поставщика</th>
            <th className={'border px-4 py-2'}>Адрес</th>
            <th className={'border px-4 py-2'}>Телефон</th>
            <th className={'border px-4 py-2'}>E-mail</th>
            <th className={'border px-4 py-2'}>WWW</th>
            <th className={'border px-4 py-2'}>Контактное лицо</th>
            <th className={'border px-4 py-2'}>ИНН</th> {/* Добавлен столбец для ИНН */}
            <th className={'border px-4 py-2'}>Примечание</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((supplier, index) => (
            <tr key={supplier.id}>
              <td className={'border w-[100px] px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'name' ? (
                  <input
                    autoFocus
                    className={'w-[90%]'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, supplier.id, 'name')}
                    type={'text'}
                    value={supplier.name}
                  />
                ) : (
                  <span onClick={() => isDirector && setEditIndex({ column: 'name', row: index })}>
                    {supplier.name}
                  </span>
                )}
              </td>
              <td className={'border w-[100px]  px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'address' ? (
                  <input
                    autoFocus
                    className={'w-full'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, supplier.id, 'address')}
                    type={'text'}
                    value={supplier.address}
                  />
                ) : (
                  <span
                    onClick={() => isDirector && setEditIndex({ column: 'address', row: index })}
                  >
                    {supplier.address}
                  </span>
                )}
              </td>
              <td className={'border w-[100px]  px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'phone' ? (
                  <input
                    autoFocus
                    className={'w-full'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, supplier.id, 'phone')}
                    type={'text'}
                    value={supplier.phone}
                  />
                ) : (
                  <span onClick={() => isDirector && setEditIndex({ column: 'phone', row: index })}>
                    {supplier.phone}
                  </span>
                )}
              </td>
              <td className={'border w-[100px]  px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'email' ? (
                  <input
                    autoFocus
                    className={'w-full'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, supplier.id, 'email')}
                    type={'text'}
                    value={supplier.email}
                  />
                ) : (
                  <span onClick={() => isDirector && setEditIndex({ column: 'email', row: index })}>
                    {supplier.email}
                  </span>
                )}
              </td>
              <td className={'border w-[100px]  px-4 py-2'}>
                <a
                  className={'text-blue-500 hover:underline'}
                  href={supplier.website}
                  rel={'noopener noreferrer'}
                  target={'_blank'}
                >
                  {supplier.website}
                </a>
              </td>
              <td className={'border w-[100px]  px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'contactPerson' ? (
                  <input
                    autoFocus
                    className={'w-full'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, supplier.id, 'contactPerson')}
                    type={'text'}
                    value={supplier.contactPerson}
                  />
                ) : (
                  <span
                    onClick={() =>
                      isDirector && setEditIndex({ column: 'contactPerson', row: index })
                    }
                  >
                    {supplier.contactPerson}
                  </span>
                )}
              </td>
              <td className={'border w-[100px]  px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'inn' ? (
                  <input
                    autoFocus
                    className={'w-full'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, supplier.id, 'inn')}
                    type={'text'}
                    value={supplier.inn}
                  />
                ) : (
                  <span onClick={() => isDirector && setEditIndex({ column: 'inn', row: index })}>
                    {supplier.inn}
                  </span>
                )}
              </td>
              <td className={'border w-[100px]  px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'notes' ? (
                  <input
                    autoFocus
                    className={'w-full'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, supplier.id, 'note')}
                    type={'text'}
                    value={supplier.note}
                  />
                ) : (
                  <span onClick={() => isDirector && setEditIndex({ column: 'notes', row: index })}>
                    {supplier.note}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDirector && (
        <button
          className={'mt-4 bg-blue-500 text-white px-4 py-2 rounded'}
          onClick={() => setIsFormOpen(true)}
        >
          Добавить поставщика
        </button>
      )}
      {isFormOpen && (
        <NewSupplierForm onAddSupplier={handleAddSupplier} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  )
}
