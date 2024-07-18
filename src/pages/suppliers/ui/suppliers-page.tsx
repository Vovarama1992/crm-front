import React, { useState } from 'react'

import { useMeQuery } from '@/entities/session'

// Пример данных поставщиков
const supplierData = [
  {
    address: 'ул. Ленина, д. 1, г. Москва',
    contactPerson: 'Иванов Иван Иванович',
    email: 'supplier1@example.com',
    name: 'ООО "Поставщик 1"',
    notes: 'Поставщик мебели',
    phone: '+7 (495) 123-45-67',
    website: 'https://supplier1.ru',
  },
  {
    address: 'ул. Пушкина, д. 2, г. Санкт-Петербург',
    contactPerson: 'Петров Петр Петрович',
    email: 'supplier2@example.com',
    name: 'ООО "Поставщик 2"',
    notes: 'Поставщик электроники',
    phone: '+7 (812) 234-56-78',
    website: 'https://supplier2.ru',
  },
  {
    address: 'ул. Горького, д. 3, г. Казань',
    contactPerson: 'Сидоров Сидор Сидорович',
    email: 'supplier3@example.com',
    name: 'ООО "Поставщик 3"',
    notes: 'Поставщик продуктов питания',
    phone: '+7 (843) 123-45-67',
    website: 'https://supplier3.ru',
  },
  {
    address: 'ул. Крупской, д. 4, г. Новосибирск',
    contactPerson: 'Кузнецов Кузьма Кузьмич',
    email: 'supplier4@example.com',
    name: 'ООО "Поставщик 4"',
    notes: 'Поставщик строительных материалов',
    phone: '+7 (383) 234-56-78',
    website: 'https://supplier4.ru',
  },
  {
    address: 'ул. Мира, д. 5, г. Екатеринбург',
    contactPerson: 'Николаев Николай Николаевич',
    email: 'supplier5@example.com',
    name: 'ООО "Поставщик 5"',
    notes: 'Поставщик медицинских товаров',
    phone: '+7 (343) 345-67-89',
    website: 'https://supplier5.ru',
  },
  // Добавьте больше данных по необходимости
]

export const SuppliersPage: React.FC = () => {
  const [tableData, setTableData] = useState(supplierData)
  const [searchName, setSearchName] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchContactPerson, setSearchContactPerson] = useState('')
  const [searchNotes, setSearchNotes] = useState('')
  const [editIndex, setEditIndex] = useState<{ column: string; row: number } | null>(null)

  const { data } = useMeQuery()
  const isDirector = data?.roleName === 'Директор'

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSearchTerm(e.target.value)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    column: string
  ) => {
    const updatedData = tableData.map((row, index) =>
      index === rowIndex ? { ...row, [column]: e.target.value } : row
    )

    setTableData(updatedData)
  }

  const filteredData = tableData.filter(
    supplier =>
      supplier.name.toLowerCase().includes(searchName.toLowerCase()) &&
      supplier.address.toLowerCase().includes(searchAddress.toLowerCase()) &&
      supplier.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
      supplier.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      supplier.contactPerson.toLowerCase().includes(searchContactPerson.toLowerCase()) &&
      supplier.notes.toLowerCase().includes(searchNotes.toLowerCase())
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
            <th className={'border px-4 py-2'}>Примечание</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((supplier, index) => (
            <tr key={index}>
              <td className={'border w-[100px] px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'name' ? (
                  <input
                    autoFocus
                    className={'w-[90%]'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, index, 'name')}
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
                    onChange={e => handleEditChange(e, index, 'address')}
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
                    onChange={e => handleEditChange(e, index, 'phone')}
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
                    onChange={e => handleEditChange(e, index, 'email')}
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
                <a href={supplier.website} rel={'noopener noreferrer'} target={'_blank'}>
                  {supplier.website}
                </a>
              </td>
              <td className={'border w-[100px]  px-4 py-2'}>
                {isDirector && editIndex?.row === index && editIndex.column === 'contactPerson' ? (
                  <input
                    autoFocus
                    className={'w-full'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, index, 'contactPerson')}
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
                {isDirector && editIndex?.row === index && editIndex.column === 'notes' ? (
                  <input
                    autoFocus
                    className={'w-full'}
                    onBlur={() => setEditIndex(null)}
                    onChange={e => handleEditChange(e, index, 'notes')}
                    type={'text'}
                    value={supplier.notes}
                  />
                ) : (
                  <span onClick={() => isDirector && setEditIndex({ column: 'notes', row: index })}>
                    {supplier.notes}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
